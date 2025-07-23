export class serviceDetails {
    id: number;
    name: string;
    description: string;
    price: string;
    time: string;
    servicedescription: string;
    contactDetails: string;
    image: string;

    constructor(
        id: number,
        name: string,
        description: string,
        price: string,
        time: string,
        servicedescription: string,
        contactDetails: string,
        image: string
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.time = time;
        this.servicedescription = servicedescription;
        this.contactDetails = contactDetails;
        this.image = image;
    }

}