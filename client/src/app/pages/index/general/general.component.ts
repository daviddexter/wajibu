import { Component } from "@angular/core"
/*import { ChartBoxComponent } from "./chart-box/chart.box.component";
import { FilterBoxComponent } from "./filter-box/filter.box.component";
import { SentimentBoxComponent } from "./sentiment-box/sentiment.box.component";
import { TopBoxComponent } from "./top-box/top.box.component";*/


@Component({
    moduleId:module.id,
    selector:"general",
    template:`
        <div class="container-col">
           <div class="container-item">
                <top-box></top-box>
           </div>
           <div class="container-item">
                <div class="container-row">
                    <div class="container-item oneth">
                        <filter-box ></filter-box>
                        <info-box></info-box>                         
                    </div>
                    <div class="container-item twoth">
                        <sentiment-box></sentiment-box>                        
                    </div>
                    <div class="container-item threeth">
                        <chart-box></chart-box>
                    </div>             
                </div>
           </div> 
        </div>
    `,
    styleUrls:["./general.component.css"]
})

export class GeneralComponent{
    
}