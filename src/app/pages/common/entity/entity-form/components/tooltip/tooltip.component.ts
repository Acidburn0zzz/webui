import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector : 'tooltip',
  templateUrl : 'tooltip.component.html',
  styleUrls : [ 'tooltip.component.css' ],
})
export class TooltipComponent {
  @Input('message') message: string;
  @Input('header') header?: string;
  @Input('position') positionOverride?: string;
  @ViewChild('tooltip', { static: true}) private tooltip: ElementRef;
  @ViewChild(CdkDrag, {static: true}) dragTarget: CdkDrag;

  public isShowTooltip: boolean;
  public tooltipMsgStyle: any;
  public isLockTooltip: boolean = false;
  public isWizard: boolean = false;

  public positionString: string = 'Default';
  public isMoved: boolean = false;

  constructor(public translate: TranslateService) {}

  showTooltip($event) {
    this.isShowTooltip = $event;

    let formParent = this.findParent();
    let screenW = document.body.clientWidth;
    let screenH = document.body.clientHeight;
    let posX = this.tooltip.nativeElement.getBoundingClientRect().left;
    let posY = this.tooltip.nativeElement.getBoundingClientRect().bottom;

    let posLeft = this.tooltip.nativeElement.offsetLeft
    let posRight = this.tooltip.nativeElement.offsetLeft + this.tooltip.nativeElement.offsetWidth;
    let posTop = this.tooltip.nativeElement.offsetTop
    let posBottom = this.tooltip.nativeElement.offsetTop + this.tooltip.nativeElement.offsetHeight;

    let dynamicWidth = this.message.length * 8.5;
    let tooltipHeight = this.tooltip.nativeElement.scrollHeight;

    this.tooltipMsgStyle = {
      'right': '32px',
      'top':'-32px',
      'min-height':'64px'
    };

    const fpr = formParent ? formParent.offsetLeft + formParent.offsetWidth : null;
    let insideJob = formParent ? (formParent.clientWidth - posRight > 300 ? true : false) : null;

    if(this.positionOverride){
      this.positionString = this.positionOverride;
    } else {
      this.positionString = insideJob ? 'right' : 'left';
    }
  }

  toggleVis(state?) {
    if (state ==='lock') {
      this.showTooltip(true);
      this.isLockTooltip = true;
      this.isShowTooltip = true;
    } else {
      this.showTooltip(false);
      this.isLockTooltip = false;
      this.isShowTooltip = false;
      setTimeout(() =>{
        this.dragTarget.reset();
        this.isMoved = false;
      }, 1000);
    }
  }

  findParent(){
    let formParent = this.tooltip.nativeElement.offsetParent;
    let card;
    if (this.tooltip.nativeElement.closest('mat-dialog-container')) {
      card = this.tooltip.nativeElement.closest('mat-dialog-container');
      this.positionOverride = 'right';
    } else if(formParent.tagName.toLowerCase() == 'mat-card'){
      card = formParent;
    } else if(formParent.offsetParent.tagName.toLowerCase() == 'mat-card'){
      card = formParent.offsetParent;
    } else if(formParent.offsetParent.offsetParent.tagName.toLowerCase() == 'mat-card'){
      card = formParent.offsetParent.offsetParent;
    } else if(formParent.offsetParent.offsetParent.offsetParent.tagName.toLowerCase() == 'mat-card'){
      card = formParent.offsetParent.offsetParent.offsetParent;
    } else if(formParent.offsetParent.offsetParent.offsetParent.offsetParent.tagName.toLowerCase() == 'mat-card'){
      card = formParent.offsetParent.offsetParent.offsetParent.offsetParent;
    }

    if(card && card.parentNode.nodeName.toLowerCase() == 'entity-wizard'){
      this.isWizard = true;
    }

    return card;
  }

  hideTail(evt?){
    this.isMoved = true;
  }

}
