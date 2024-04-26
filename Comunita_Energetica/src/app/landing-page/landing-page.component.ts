import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Application } from '@splinetool/runtime';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})

export class LandingPageComponent implements OnInit {
    @ViewChild('burger', { static: true }) burger!: ElementRef;
    @ViewChild('canvas', { static: true }) canvas!: ElementRef;

    isBurgerActive: boolean = false;

    ngOnInit(): void {
        this.loadCanvas();
        this.showBurger();
        console.log(this.burger);
    };

    showBurger(): void {
        gsap.registerPlugin(ScrollTrigger)
        gsap.to(this.burger, {
            scrollTrigger: {
                trigger: document.documentElement,
                start: 0,
                end: window.innerHeight,
                onLeave: () => {gsap.to(this.burger.nativeElement, {scale: 1, duration: 0.25, ease: "power1.out"})},
                onEnterBack: () => {gsap.to(this.burger.nativeElement, {scale: 0, duration: 0.25, ease: "power1.out"})}
            }
        })
    };

    toggleBurger(): void {
        this.isBurgerActive = !this.isBurgerActive;
    };
    
    loadCanvas = () => {
        const app = new Application(this.canvas.nativeElement);
        app.load('https://prod.spline.design/BG4bjPoQSPboMO2Y/scene.splinecode');
    };
}
