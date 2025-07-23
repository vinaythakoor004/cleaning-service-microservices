import {
  Component,
  OnInit,
  OnChanges,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  SimpleChanges,
} from '@angular/core';
import * as d3 from 'd3';
import { CommonModule } from '@angular/common';

// --- Interfaces for Data Structures ---
// Represents a single booking detail
export interface BookingDetail {
  serviceName: string;
  bookingDateTime: string;
  address: string;
  time: string;
  price: string;
  slot?: string; // Optional slot information
}

// Represents a full booking record
export interface BookingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  country: string;
  bookingDetails: BookingDetail;
  id: number;
}

// Represents a value for a pie slice within a bubble
export interface PieValue {
  price: string;
  time: string;
  slot?: string; // Added slot to PieValue
  count: number;
  // Added to store a sample booking's details for the tooltip
  sampleBookingDetail?: BookingDetail;
  sampleBookingPerson?: { firstName: string; lastName: string; email: string; };
}

// Represents the grouped data for a single bubble (service)
export interface GroupedServiceData {
  serviceName: string;
  value: number; // Total count for the service, used for bubble size
  pieValues: PieValue[]; // Array of pie data for this service, used for inner pie chart
}

// Extends D3's HierarchyCircularNode to include x, y, r properties for bubble layout
interface D3BubbleNode extends d3.HierarchyCircularNode<GroupedServiceData> {
  x: number;
  y: number;
  r: number;
  data: GroupedServiceData; // Explicitly type the data property
}

@Component({
  selector: 'app-bubble-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bubble-chart.component.html',
  styleUrls: ['./bubble-chart.component.css'],
})
export class BubbleChartComponent implements OnInit, OnChanges, AfterViewInit {
  // Reference to the main chart container in the template
  @ViewChild('bubbleChartContainer', { static: true })
  private bubbleChartContainer!: ElementRef;

  // Reference to the tooltip element in the template
  @ViewChild('tooltip', { static: true })
  private tooltipRef!: ElementRef;

  // Input property to receive raw booking data from a parent component
  @Input() bookingData: Array<BookingData> = [];
  // Processed and grouped data for the bubble chart
  private groupedData: GroupedServiceData[] = [];

  // D3 SVG selection for the main chart
  private bubbleSvg: any;
  // Dimensions for the SVG viewBox
  private bubbleWidth = 1200; // Increased width for more space
  private bubbleHeight = 1000; // Increased height for more space
  private margin = 20; // Margin around the packed bubbles

  /**
   * Lifecycle hook: Called once after the component's properties are initialized.
   * Processes initial booking data if available.
   */
  ngOnInit(): void {
    console.log('BubbleChartComponent: ngOnInit called.');
    if (this.bookingData && this.bookingData.length > 0) {
      this.groupedData = this.groupBookingData(this.bookingData);
      console.log('BubbleChartComponent: Grouped data in ngOnInit:', this.groupedData);
    } else {
      console.log('BubbleChartComponent: bookingData is empty in ngOnInit or not yet available.');
    }
  }

  /**
   * Lifecycle hook: Called after Angular initializes the component's views and child views.
   * Creates the bubble chart if the container and data are ready.
   */
  ngAfterViewInit(): void {
    console.log('BubbleChartComponent: ngAfterViewInit called.');
    if (this.bubbleChartContainer && this.bubbleChartContainer.nativeElement && this.groupedData && this.groupedData.length > 0) {
      console.log('ngAfterViewInit: Containers and data available, calling bubble chart creation.');
      this.createBubbleChart();
    } else if (this.bookingData && this.bookingData.length > 0 && (!this.groupedData || this.groupedData.length === 0)) {
        // If data was received after ngOnInit but before ngAfterViewInit
        this.groupedData = this.groupBookingData(this.bookingData);
        console.log('ngAfterViewInit: Data processed, calling bubble chart creation.');
        this.createBubbleChart();
    }
    else {
      console.warn('ngAfterViewInit: Bubble chart not drawn. Container or data not yet available (after view init).');
    }
  }

  /**
   * Lifecycle hook: Called when any data-bound input property changes.
   * Re-processes data and redraws the chart if `bookingData` changes.
   * @param changes An object containing changed properties.
   */
  ngOnChanges(changes: SimpleChanges): void {
    console.log('BubbleChartComponent: ngOnChanges called.', changes);
    if (changes['bookingData'] && changes['bookingData'].currentValue) {
      console.log('BubbleChartComponent: Input bookingData in ngOnChanges:', changes['bookingData'].currentValue);
      this.groupedData = this.groupBookingData(changes['bookingData'].currentValue);
      console.log('BubbleChartComponent: Grouped data in ngOnChanges:', this.groupedData);

      // Only re-draw if the container is already available (i.e., after initial view init)
      if (this.bubbleChartContainer && this.bubbleChartContainer.nativeElement) {
        console.log('ngOnChanges: Containers and new data available, re-drawing bubble chart.');
        this.createBubbleChart();
      } else {
        console.warn('ngOnChanges: New data arrived, but bubble chart container not yet ready. Chart will be drawn in ngAfterViewInit or next change detection cycle.');
      }
    }
  }

  /**
   * Creates or updates the D3 bubble chart with nested pie charts.
   */
  private createBubbleChart(): void {
    console.log('createBubbleChart: Attempting to create bubble chart.');
    if (!this.bubbleChartContainer || !this.bubbleChartContainer.nativeElement) {
      console.error('Bubble chart container not found in DOM for rendering. Aborting chart creation.');
      return;
    }
    const container = this.bubbleChartContainer.nativeElement;
    console.log('createBubbleChart: Chart container element found:', container);

    // Clear any existing SVG to prevent duplicates on redraw
    d3.select(container).select('svg').remove();
    console.log('createBubbleChart: Old SVG removed (if any).');

    // Append the main SVG element for the bubble chart
    try {
      this.bubbleSvg = d3
        .select(container)
        .append('svg')
        .attr('width', '100%') // Make SVG fill its container width
        .attr('height', '100%') // Make SVG fill its container height
        .attr('viewBox', `0 0 ${this.bubbleWidth} ${this.bubbleHeight}`) // Define the internal coordinate system
        .attr('preserveAspectRatio', 'xMidYMid meet') // Maintain aspect ratio and center
        .attr('stroke', 'black') // Add black border around the entire SVG
        .attr('stroke-width', 2); // Set border width
      console.log('createBubbleChart: SVG appended successfully.');
    } catch (e) {
      console.error('createBubbleChart: Error during SVG append:', e);
      return;
    }

    // Initialize D3's pack layout for creating the bubble hierarchy
    const pack = d3
      .pack<GroupedServiceData>()
      .size([this.bubbleWidth - this.margin * 2, this.bubbleHeight - this.margin * 2]) // Size of the packing area
      .padding(15); // Reduced padding further to 15

    // Create a hierarchical data structure from the grouped data
    const root = d3
      .hierarchy<GroupedServiceData>({
        serviceName: 'root', // Dummy root node
        value: d3.sum(this.groupedData, d => d.value), // Sum of all service counts
        pieValues: [],
        children: this.groupedData
      } as any) // Type assertion for the root node structure
      .sum((d) => d.value); // Tell D3 to use the 'value' property for bubble sizing

    // Apply the pack layout to the root to get the bubble nodes
    const nodes = pack(root).leaves() as D3BubbleNode[];
    console.log('createBubbleChart: Nodes for chart (after pack):', nodes);

    // Custom color palettes using distinct D3 schemes for main bubbles and inner slices
    // For main bubbles, use a scheme with many distinct colors
    const bubbleColorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // For pie slices, use a different scheme for internal distinction
    const pieColorScale = d3.scaleOrdinal(d3.schemeSet3);


    // Store a reference to the component instance for event handlers
    const componentInstance = this;

    // Create a 'g' element for each bubble group (main circle + inner pie + labels)
    const bubbleGroups = this.bubbleSvg
      .selectAll('g.bubble-group')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'bubble-group')
      .attr(
        'transform',
        // Translate each group to the center of its respective bubble
        (d: D3BubbleNode) => `translate(${d.x + this.margin}, ${d.y + this.margin})`
      );

    // Add the nested pie chart inside each bubbleGroup
    bubbleGroups.each(function(this: SVGGElement, d: D3BubbleNode) {
        const bubbleGroupSelection = d3.select(this); // Select the current bubble group
        const pieData = d.data.pieValues;

        if (!pieData || pieData.length === 0) {
            console.warn(`No pie data for service: ${d.data.serviceName}`);
            return;
        }

        // Define inner and outer radii for the pie chart
        // Set innerRadius to 0 for a full pie chart (no donut hole)
        const innerPieRadius = 0;
        const outerPieRadius = d.r * 0.9; // Outer radius remains relative to bubble size

        // D3 pie generator
        const pie = d3.pie<PieValue>()
            .value((pv: PieValue) => pv.count) // Use 'count' (now a number) for pie slice size
            .sort(null); // No sorting, maintain original order

        // D3 arc generator for drawing pie slices
        const arc = d3.arc<d3.PieArcDatum<PieValue>>()
            .innerRadius(innerPieRadius) // Set to 0 for full pie chart
            .outerRadius(outerPieRadius);

        // Prepare data for the pie generator
        const dataReadyForPie = pie(pieData);

        // Append a 'g' element for the inner pie chart
        const pieChartGroup = bubbleGroupSelection.append('g')
            .attr('class', 'inner-pie-chart');

        // Draw pie slices
        pieChartGroup.selectAll('path.pie-slice')
            .data(dataReadyForPie)
            .enter()
            .append('path')
            .attr('class', 'pie-slice')
            .attr('fill', (pd: d3.PieArcDatum<PieValue>) => pieColorScale(pd.data.price)) // Color by price
            .attr('stroke', 'transparent') // Set stroke to transparent
            .attr('stroke-width', 0) // Set stroke-width to 0
            .style('opacity', 0.9)
            // Mouseover interaction for pie slices using D3 transitions
            .on('mouseover', function(this: SVGPathElement, event: MouseEvent, pd: d3.PieArcDatum<PieValue>) {
                console.log('Mouseover on pie slice:', pd.data); // Log pie slice data
                const originalColor = d3.select(this).attr('fill');

                d3.select(this)
                    .attr('data-original-fill', originalColor) // Store original color
                    .transition().duration(150) // Short transition for quick feedback
                    .ease(d3.easeQuadOut) // Smooth easing
                    .attr('transform', `scale(1.08)`) // Slightly larger scale on hover
                    .attr('fill', d3.color(originalColor)?.darker(0.8)?.toString() || originalColor); // Darken the color more noticeably

                if (componentInstance.tooltipRef && componentInstance.tooltipRef.nativeElement) {
                    const tooltipEl = componentInstance.tooltipRef.nativeElement as HTMLDivElement;
                    tooltipEl.style.opacity = '1';
                    // Display more detailed information from sampleBookingPerson and sampleBookingDetail
                    tooltipEl.innerHTML = `
                      <span>Service:</span> ${d.data.serviceName}<br/>
                      <span>Time:</span> ${pd.data.time}<br/>
                      <span>Price:</span> ${pd.data.price}<br/>
                      ${pd.data.slot ? `<span>Slot:</span> ${pd.data.slot}<br/>` : ''}
                      <span>Count:</span> ${pd.data.count}<br/>
                      ${pd.data.sampleBookingPerson ? `<span>Customer:</span> ${pd.data.sampleBookingPerson.firstName} ${pd.data.sampleBookingPerson.lastName}<br/>` : ''}
                      ${pd.data.sampleBookingPerson?.email ? `<span>Email:</span> ${pd.data.sampleBookingPerson.email}<br/>` : ''}
                      ${pd.data.sampleBookingDetail?.address ? `<span>Address:</span> ${pd.data.sampleBookingDetail.address}<br/>` : ''}
                    `;
                }
            })
            // Mousemove to update tooltip position
            .on('mousemove', function(this: SVGPathElement, event: MouseEvent) {
                if (componentInstance.tooltipRef && componentInstance.tooltipRef.nativeElement) {
                    const tooltipEl = componentInstance.tooltipRef.nativeElement as HTMLDivElement;
                    tooltipEl.style.left = event.pageX + 10 + 'px';
                    tooltipEl.style.top = event.pageY + 10 + 'px';
                }
            })
            // Mouseout to revert slice style and hide tooltip using D3 transitions
            .on('mouseout', function(this: SVGPathElement) {
                console.log('Mouseout on pie slice'); // Log mouseout
                const originalColor = d3.select(this).attr('data-original-fill'); // Retrieve original color

                d3.select(this).transition().duration(150) // Short transition for quick feedback
                    .ease(d3.easeQuadOut) // Smooth easing
                    .style('opacity', 0.9)
                    .attr('transform', `scale(1)`) // Revert scale
                    .attr('fill', originalColor); // Revert to original color

                if (componentInstance.tooltipRef && componentInstance.tooltipRef.nativeElement) {
                    const tooltipEl = componentInstance.tooltipRef.nativeElement as HTMLDivElement;
                    tooltipEl.style.opacity = '0';
                }
            })
            // Initial drawing animation for pie slices
            .each(function(this: SVGPathElement, pd: d3.PieArcDatum<PieValue>) {
                (this as any)._current = { startAngle: 0, endAngle: 0 }; // Store initial angles for tweening
            })
            .transition()
            .duration(750)
            .delay((pd: d3.PieArcDatum<PieValue>, i: number) => i * 100) // Staggered delay for animation
            .attrTween('d', function(this: SVGPathElement, pd: d3.PieArcDatum<PieValue>) {
                const interpolate = d3.interpolate((this as any)._current, pd);
                (this as any)._current = interpolate(0);
                return (t: number) => arc(interpolate(t))!; // Interpolate path data
            })
            .on('end', function(this: SVGPathElement) {
                     // Ensure final state is correctly rendered
                     d3.select(this).attr('d', arc(d3.select(this).datum() as d3.PieArcDatum<PieValue>));
            });

        // Add text labels to pie slices (counts)
        pieChartGroup.selectAll('text.pie-label')
            .data(dataReadyForPie)
            .enter()
            .append<SVGTextElement>('text') // Explicitly type the appended element
            .attr('class', 'pie-label')
            .attr('transform', (pd: d3.PieArcDatum<PieValue>) => `translate(${arc.centroid(pd)})`) // Position at centroid of slice
            .attr('text-anchor', 'middle')
            .style('font-size', ((pd: d3.PieArcDatum<PieValue>) => `${Math.max(8, d.r / 5)}px`) as (datum: d3.PieArcDatum<PieValue>) => string)
            .style('fill', 'black')
            .style('pointer-events', 'none') // Prevent text from blocking mouse events on slices
            .text((pd: d3.PieArcDatum<PieValue>) => pd.data.count > 0 ? String(pd.data.count) : '') // Display count if > 0
            .filter((pd: d3.PieArcDatum<PieValue>) => (pd.endAngle - pd.startAngle) > 0.3) // Increased threshold for showing labels
            .style('opacity', 0) // Start with opacity 0 for fade-in
            .transition()
            .delay((pd, i) => 750 + i * 50) // Delay after bubble/pie animation
            .duration(500)
            .style('opacity', 1); // Fade in


        // Labels for the main bubbles (service name) - centered in the pie chart
        bubbleGroupSelection
            .append<SVGTextElement>('text') // Explicitly type the appended element
            .attr('class', 'bubble-service-name')
            .attr('text-anchor', 'middle')
            .attr('dy', '0.35em') // Vertically center text
            .style('font-size', ((node: any) => `${Math.max(10, node.r / 6)}px`) as (datum: any) => string)
            .style('fill', 'white') // Keep white fill for contrast with dark pie slices
            .style('pointer-events', 'none')
            .text((node: any) => node.data.serviceName)
            // Filter out labels for very small bubbles where they won't fit
            .filter((node: any) => node.r >= 30) // Only show for bubbles with radius >= 30
            .style('opacity', 0) // Start with opacity 0 for fade-in
            .transition()
            .delay(750) // Delay after bubble animation
            .duration(500)
            .style('opacity', 1); // Fade in
    });


      // Tooltip interactions for the main bubbles (now effectively the pie chart areas)
      bubbleGroups
        .on('mouseover', function (this: SVGGElement, event: MouseEvent, d: D3BubbleNode) {
            console.log('Mouseover on main bubble area (pie chart):', d.data.serviceName); // Log main bubble data
            // Hide pie slice tooltip if it's visible
            if (componentInstance.tooltipRef && componentInstance.tooltipRef.nativeElement) {
                componentInstance.tooltipRef.nativeElement.style.opacity = '0';
            }

            // No main circle to apply stroke to, but we can still show the tooltip for the overall service
            if (componentInstance.tooltipRef && componentInstance.tooltipRef.nativeElement) {
                const tooltipEl = componentInstance.tooltipRef.nativeElement as HTMLDivElement;
                tooltipEl.style.opacity = '1';
                tooltipEl.innerHTML = `
                  <span>${d.data.serviceName}</span><br/>
                  <span>Total Bookings:</span> ${d.data.value}
                `;
            }
        })
        .on('mousemove', function (this: SVGGElement, event: MouseEvent) {
            // Update tooltip position
            if (componentInstance.tooltipRef && componentInstance.tooltipRef.nativeElement) {
                const tooltipEl = componentInstance.tooltipRef.nativeElement as HTMLDivElement;
                tooltipEl.style.left = event.pageX + 10 + 'px';
                tooltipEl.style.top = event.pageY + 10 + 'px';
            }
        })
        .on('mouseout', function (this: SVGGElement, event: MouseEvent, d: D3BubbleNode) {
            console.log('Mouseout on main bubble area (pie chart)'); // Log mouseout
            // No main circle to revert stroke on
            if (componentInstance.tooltipRef && componentInstance.tooltipRef.nativeElement) {
                const tooltipEl = componentInstance.tooltipRef.nativeElement as HTMLDivElement;
                tooltipEl.style.opacity = '0';
            }
        });
  }

  /**
   * Groups raw booking data by service name and aggregates counts and pie values.
   * @param data The raw booking data array.
   * @returns An array of GroupedServiceData suitable for the bubble chart.
   */
  private groupBookingData(data: BookingData[]): GroupedServiceData[] {
    const groupedMap = new Map<string, {
      serviceName: string;
      totalCount: number;
      pieValuesMap: Map<string, PieValue>; // Changed to store PieValue directly
    }>();

    data.forEach(item => {
      const serviceName = item.bookingDetails.serviceName;
      const price = item.bookingDetails.price;
      const time = item.bookingDetails.time;
      const slot = item.bookingDetails.slot; // Get slot

      // Initialize service entry if it doesn't exist
      if (!groupedMap.has(serviceName)) {
        groupedMap.set(serviceName, {
          serviceName: serviceName,
          totalCount: 0,
          pieValuesMap: new Map<string, PieValue>(),
        });
      }

      const serviceEntry = groupedMap.get(serviceName)!;
      serviceEntry.totalCount++; // Increment total count for the service

      // Create a unique key for price-time-slot combinations for inner pie slices
      const pieValueKey = `${price}-${time}-${slot || 'no-slot'}`; // Include slot in key
      if (!serviceEntry.pieValuesMap.has(pieValueKey)) {
        // If this combination is new, initialize it with current item's details as sample
        serviceEntry.pieValuesMap.set(pieValueKey, {
          price: price,
          time: time,
          slot: slot,
          count: 0, // Will be incremented below
          sampleBookingDetail: item.bookingDetails, // Store full booking details
          sampleBookingPerson: { // Store person details
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email
          }
        });
      }
      serviceEntry.pieValuesMap.get(pieValueKey)!.count++; // Increment count for specific price-time-slot
    });

    // Convert the map to the final array structure
    const finalGroupedData: GroupedServiceData[] = [];
    groupedMap.forEach(serviceEntry => {
      const pieValuesArray: PieValue[] = Array.from(serviceEntry.pieValuesMap.values());

      finalGroupedData.push({
        serviceName: serviceEntry.serviceName,
        value: serviceEntry.totalCount,
        pieValues: pieValuesArray,
      });
    });

    return finalGroupedData;
  }
}
