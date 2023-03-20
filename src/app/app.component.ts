import { Component, inject, NgZone, HostListener  } from '@angular/core';
import { SixeStateService } from 'sixe';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  zone = inject(NgZone);
  input = '';
  stateService: any;
  state: any;
  state2: any;
  constructor() {

  }

  ngOnInit() {
    this.stateService = new SixeStateService('sixe');

    this.stateService.setState({
      name: 'sixe',
      data: {
        fruits: ['orange', 'mango'],
        count: 0,
      },
    });
    this.stateService.sixe.onmessage = (event: any) => {
      this.zone.run(() => {
        this.state = event?.data;
      });
    };

    this.anotherState();
  }

  anotherState(){
    const state = new SixeStateService('test');
    state.setState({
      name: 'test',
      data: {
        fruits: ['apple', 'elppa'],
        count: 0,
      },
    });
    state.sixe.onmessage = (event: any) => {
      console.log(event?.data);
      this.zone.run(() => {
         this.state2 = event?.data;
         console.log(this.state2);
      });
    };
  }

  addFn() {
    if (this.input)
      this.stateService.setState({
        name: 'sixe',
        data: {
          ...this.state?.sixe,
          fruits: [...this.state?.sixe?.fruits, this.input],
        },
      });
    this.input = '';
  }

  countFn() {
    this.stateService.setState({
      name: 'sixe',
      data: {
        ...this.state?.sixe,
        count: this.state?.sixe.count + 1,
      },
    });
  }

  removeFn(item:any) {
    this.stateService.setState({
      name: 'sixe',
      data: {
        ...this.state?.sixe,
        fruits: this.state?.sixe?.fruits.filter((res:any) => res != item),
      },
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    if(!this.state || this.state.connections == 1)
      this.stateService.close();
  }
}
