import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Article } from 'src/app/interfaces';
import { NewsService } from 'src/app/services/news.service';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  // @input Sirve para recibir las propiedades que puede mandar el "padre"

  @ViewChild(IonInfiniteScroll, {static: true} ) infiniteScroll: IonInfiniteScroll;

  public categories: string [] = ['business','entertainment','general','health','science','sports','technology'];
  public selectedCategory: string = this.categories[0];
  public articles: Article[] = []; 

  constructor( private newsService: NewsService) {}

  ngOnInit() {
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory)
    .subscribe( articles => {
      this.articles = [ ...articles ]
    })
  }

  segmentChanged( event: Event ){
    this.selectedCategory = (event as CustomEvent).detail.value;
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory)
    .subscribe( articles => {
      this.articles = [...articles]
    })
  }

  loadData( ){
    this.newsService.getTopHeadlinesByCategory(this.selectedCategory, true)
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
