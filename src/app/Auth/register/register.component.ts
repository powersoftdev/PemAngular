import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registartionForm:FormGroup

  constructor(private formBuilder:FormBuilder) { 
    this.registartionForm = new FormGroup({
      fname: new FormControl(),
      lname: new FormControl(),
      email: new FormControl(),
      password: new FormControl()
    });

     //Validation 
     this.registartionForm = this.formBuilder.group({
      fname: ['', [Validators.required]],
      lname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email,]],
      password: ['', [Validators.required]]

      

    })
  }

  ngOnInit(): void {}
 
  register(registartionForm:FormGroup){
    console.log(this.registartionForm.value)
  }
}
