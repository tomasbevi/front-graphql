import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Apollo , gql  } from 'apollo-angular';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit , OnDestroy  {
  rates: any[] = [];
  loading = true;
  error: any;
  sorteos: any;
  querySubscription!: Subscription;
  
  constructor(private apollo: Apollo) {
  }

  ngOnInit() {
    this.simpleQuery();
  }

  
  simpleMutation() {
    this.apollo.mutate({
      mutation: gql`
      mutation login($identifier: String!, $password: String!) {
        login(input: {identifier: $identifier, password: $password}) {
               jwt
               user{
                 id
                 username
                 email
               }
        }
   }`,
   variables: {
    identifier: 'usersorteo@gmail.com',
    password: 'a123321'
  }
  }).subscribe(data => {
    console.log(data)
  });
  }


  changeSorteoName(valor:string) {
    this.apollo.mutate({
      mutation: gql`
      mutation updateSorteo($input : SorteoInput! , $id : ID!){
        updateSorteo(id:$id , data:$input){
            data{
              attributes{
                nombre
                nros{
                  data{
                    attributes{
                      numero
                    }
                  }
                }
              }
            }
      }
    }
      `,
   variables: {
    id:  "1",
    input: {
      nombre: valor
    }
  }
  }).subscribe(data => {
    console.log(data)
  });

  }


  simpleQuery() {
    this.querySubscription = this.apollo.watchQuery({
      query: gql`
      query getSorteos{
        sorteos(filters: {available: {eq:true}}){
          data{
            id
            attributes{
              nombre
              publishedAt
              updatedAt
            }
          }
        }
    }
      `,

      fetchPolicy: 'cache-and-network',

      // pollInterval: 500,
    })
    .valueChanges.subscribe(({ data, loading }) => {
      this.sorteos = data;
      this.loading = loading;
    });

  }

  ngOnDestroy() {
    this.querySubscription.unsubscribe();
  }
}
