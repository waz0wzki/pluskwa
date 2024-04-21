import { Injectable } from "@angular/core";

@Injectable()
export class TimeService
{
    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}