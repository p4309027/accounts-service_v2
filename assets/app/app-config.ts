import { Headers} from "@angular/http";

export const appConfig = {
    apiUrl: "http://localhost:3000/as/api/",
    header: new Headers({'Content-Type': 'application/json'})
}