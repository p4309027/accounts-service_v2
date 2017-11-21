export class AddressModel {
    constructor(public houseNumber: string,
                public street: string,
                public city: string,
                public postcode:string,
                public userId?: string,
                public _id?:string) {}
}