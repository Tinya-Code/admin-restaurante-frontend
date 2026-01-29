import { Component } from '@angular/core';
import { Header } from "../../shared/components/header/header";
import { App } from "../../app";

@Component({
  selector: 'app-auth-layout',
  imports: [Header, App],
  templateUrl: './auth-layout.html',
  styleUrl: './auth-layout.css',
})
export class AuthLayout {

}
