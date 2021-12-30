import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Post } from "./post.model";

@Injectable({providedIn: 'root'})
export class PostsService{
    constructor (private http: HttpClient){}
    error = new Subject<string>();

createAndStorePosts (title: string, content: string){
    const postData: Post = {title: title, content: content};
    this.http
    .post<{name: string}>(
      'https://angularpg-ff730-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
      postData
    )
    .subscribe(responseData => {
      console.log(responseData);
    }, error => {
        this.error.next(error.messsage);
    });
}


fetchPosts(){
    return this.http.
    get<{[key: string]: Post}>
    ('https://angularpg-ff730-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
    {
      headers: new HttpHeaders({'Custom-Header':'Hello'}),
      params: new HttpParams().set('print', 'pretty')
    })
    .pipe(map(responseData  =>{
     
      const postsArray: Post[] = [];

      for (const key in responseData){
        if (responseData.hasOwnProperty(key)){
        postsArray.push({...responseData[key], id: key})
      }
    }
    return postsArray;
    }), 
    catchError(errResponse=>{
        return throwError(errResponse);
    }))
}

clearPosts(){
    return this.http.delete('https://angularpg-ff730-default-rtdb.europe-west1.firebasedatabase.app/posts.json');

       /*  const len=this.loadedPosts.length;
    this.loadedPosts.splice(0, len);
} */
}
}

