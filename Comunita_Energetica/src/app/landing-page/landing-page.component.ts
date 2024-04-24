import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Application } from '@splinetool/runtime';
import gsap from 'gsap';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent implements OnInit {
    @ViewChild('canvas', { static: true }) canvas!: ElementRef;

    ngOnInit(): void {
        this.loadCanvas()
    };
    
    loadCanvas = () => {
        const app = new Application(this.canvas.nativeElement);
        app.load('https://prod.spline.design/BG4bjPoQSPboMO2Y/scene.splinecode');
    }
}
