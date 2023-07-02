import { Component, OnInit } from '@angular/core';

import { LoginService } from 'src/app/Services/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

public Data:any ;
  currentUser: any;

  constructor(private lService:LoginService) { }

  ngOnInit(): void {

      
   
     
  }
 
//  GetData(){
//   this.lService.Get().subscribe(res=>{
//     this.Data=res
//     console.log("LOG",this.Data);
//   });

//   this.currentUser = JSON.parse(localStorage.getItem('user') || '{}');
//   console.log(this.currentUser);
  
//  }
}
