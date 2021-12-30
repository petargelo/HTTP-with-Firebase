import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Post } from './post.model';
import { PostsService } from './posts.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = false;
  greska = null;
  private errorSub: Subscription;

  constructor(private http: HttpClient, private postsService: PostsService) {}

  ngOnInit() {
    this.errorSub=this.postsService.error.subscribe(errorMessage=>{
      this.greska=errorMessage;
    })
    this.onFetchPosts();
    /* this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts=>{
      this.isFetching = false;
      this.loadedPosts=posts;
    }); */
  }

  onCreatePost(postData) {
      this.postsService.createAndStorePosts(postData.title, postData.content);
      this.errorSub=this.postsService.error.subscribe(errorMessage=>{
        this.greska=errorMessage;
      }) 
  }

  onFetchPosts() {
    this.isFetching = true;
    this.postsService.fetchPosts().subscribe(posts=>{
      this.isFetching = false;
      this.loadedPosts=posts;
    }, error => {
      this.greska=error.name;
      this.isFetching=false;
      console.log(error);
    }
    );
  }

  onClearPosts() {
    this.postsService.clearPosts().subscribe(()=>
      {
        this.loadedPosts.splice(0);
      });
  }

  onHandleError(){
    this.greska=null;
  }
  ngOnDestroy(){
    this.errorSub.unsubscribe();
  }
}

