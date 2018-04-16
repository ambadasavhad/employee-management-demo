import { Injectable } from '@angular/core';

@Injectable()
export class NavbarService {
    visible: boolean;
    username:any;
    constructor() { this.visible = false; }

    hide() { this.visible = false; }

    show() { this.visible = true; }

    toggle() { this.visible = !this.visible; }

    setUserName(user){ this.username = user}

    getUserName(){ return this.username}
}