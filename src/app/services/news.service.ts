import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NewsResponse, Article, ArticlesByCategoryAndPage } from '../interfaces';
import { map } from 'rxjs/operators';

const apiKey = environment.apiKey;
const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  private articlesByCategoryAndPage: ArticlesByCategoryAndPage = {};

  constructor(private http: HttpClient) { }

  private executeQuery<T>( endpoint: string){
    console.log('Petición HTTP realizada.')
    return this.http.get<T>(`${apiUrl}${endpoint}`, {
      params: { apiKey, 
      country: 'us' 
    }
    })
  }

  getTopHeadlines():Observable<Article[]>{


    return this.getTopHeadlinesByCategory('business');
    //return this.executeQuery(`/top-headlines?category=business`)
    //.pipe(
    //  map(({ articles }) => articles  )
    //);

  }

  getTopHeadlinesByCategory(category: string, loadMore: boolean = false): Observable<Article[]>{

    if (loadMore) {
      return this.getArticlesByCategory( category );//si el usuario quiere cargar más, se carga más
    }

    if ( this.articlesByCategoryAndPage[category] ){ //Si no quiere cargar mas, se verifica que exista la categoria
      return of(this.articlesByCategoryAndPage[category].articles); //Se importa of que permite construir un observable basado en el argumento de la linea de codigo
    }


    return this.getArticlesByCategory( category );  
  }

  private getArticlesByCategory (category: string ): Observable<Article[]> {

    if ( Object.keys( this.articlesByCategoryAndPage ).includes( category ) ){
      //Ya existe
      //this.articlesByCategoryAndPage[category].page += 1;
    } else {
      //No existe
      this.articlesByCategoryAndPage[category] = {
        page: 0,
        articles: []//si no existe, crea todo el objeto
      }
    }

    const page = this.articlesByCategoryAndPage[category].page + 1;

    return this.executeQuery<NewsResponse>(`/top-headlines?category=${ category }&page=${ page }`)
    .pipe(
      map(({ articles }) => {

        if (articles.length === 0) return this.articlesByCategoryAndPage[category].articles;

        this.articlesByCategoryAndPage[category] = {
          page: page,
          articles: [ ...this.articlesByCategoryAndPage[category].articles, ...articles]
        }

        return this.articlesByCategoryAndPage[category].articles;
      })//Se hace la peticion y se almacena
    );


  }

  

}
