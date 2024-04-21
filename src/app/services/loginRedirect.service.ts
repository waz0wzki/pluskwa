import { Injectable } from "@angular/core";


@Injectable()
export class LoginRedirect
{

    isEmptyObject(obj:any) {
        return (obj && (Object.keys(obj).length === 0));
      }



    redirect(user:any,router:any) 
    {
        if(!user || this.isEmptyObject(user))
        {
            router.navigate(['login'])
        }
    }
}