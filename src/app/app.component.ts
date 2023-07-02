import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'LogInTask';


  ngOnInit(): void {


  }

  // user=[
  //   {
  //     userName:'VPL/00001',
  //     password:'x!2',
  //     token:'741258'
  //   }
  // ]
  //   display(){
  //     localStorage.setItem('user',JSON.stringify(this.user))
  //   }
}
