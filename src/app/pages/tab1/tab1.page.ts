import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{

  @ViewChild(IonInfiniteScroll, {static: true} ) infiniteScroll: IonInfiniteScroll;
  public articles: Article[] = [];

  constructor( private newsService: NewsService) {}
  
  ngOnInit() {
      this.newsService.getTopHeadlines()
      .subscribe( articles => this.articles.push( ...articles ));
  }

  loadData( ){
    this.newsService.getTopHeadlinesByCategory( 'business', true)
    .subscribe( articles => {

      if ( articles.length === this.articles.length ){
        this.infiniteScroll.disabled = true;//Deshabilita el infinite scroll para que no hayan más peticiones http
        return;
      }

      this.articles =  articles;
      this.infiniteScroll.complete();
        //event.target.complete(); //Se llama el fin del infinite scroll
    })
  }
}
