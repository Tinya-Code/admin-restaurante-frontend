import { Component } from '@angular/core';
import { Header } from "../../shared/components/header/header";
import { App } from "../../app";

@Component({
  selector: 'app-admin-layout',
  imports: [Header, App],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {

}
