import { Component, ViewChild, OnInit,ChangeDetectorRef } from '@angular/core';
import {MdSnackBar } from "@angular/material";
import { FormBuilder, FormGroup, Validators,FormControl} from "@angular/forms";
import{ DashService } from "../../../../../../services/dash.service";

import { FieldConfig } from '../../../../../../dynamic-form/models/field-config.interface';
import { DynamicFormComponent } from '../../../../../../dynamic-form/containers/dynamic-form/dynamic-form.component';
@Component({
    moduleId:module.id,
    selector:"sentiment",
    template:`
        <div>
            <Section>
                <h3>Choose Sentiment Level</h3>
                <md-radio-group class="top-radio-group" (change)="choiceChange($event.value)">                   
                    <md-radio-button class="top-radio-group-item" *ngFor="let level of levels" [value]="level">
                        Show {{level}}
                    </md-radio-button>                    
                </md-radio-group><br>
                <md-radio-group class="top-radio-group" *ngIf="showTopForm" (change)="choiceTopChange($event.value)">
                    <md-radio-button class="top-radio-group-item" *ngFor="let level of toplevels" [value]="level">
                        Add Sentiment For  {{level}}
                    </md-radio-button>  
                </md-radio-group>
            </Section>
            <!--<Section>
                <md-chip-list>
                    <md-chip *ngIf="presConfig.length <= 0"> Error : Could not initilize president level data</md-chip>
                    <md-chip *ngIf="dpresConfig.length <= 0"> Error : Could not initilize deputy president level data</md-chip>
                    <md-chip>Error : could not initilize house level data</md-chip>
                    <md-chip>Error : Could not initilize subgovernment level data</md-chip>
                     <md-chip>Error : Could not initilize grassroot level data</md-chip>
                </md-chip-list> 
            </Section><br><br> --><br>
            <Section><md-spinner *ngIf="processingSubmit" style="width:25px;height:25px;margin-bottom:10px;"></md-spinner></Section>                                           
            <Section *ngIf="showPres">
                <dynamic-form [config]="presConfig"  #form="dynamicForm" (submit)="submit($event)"></dynamic-form>            
            </Section>
            <Section *ngIf="showDPres">
                <dynamic-form [config]="dpresConfig"  #form="dynamicForm" (submit)="submit($event)"></dynamic-form>                        
            </Section> 

            <Section *ngIf="showHouseForm">
                <div class="house-level-configure">
                    <div class="house-level-configure-item">
                        <form [formGroup]="chooseHouseForm">
                            <md-select class="choose-house-select" placeholder="Choose a House" formControlName="houseName">
                                    <md-option *ngFor="let house of houselevels" [value]="house"  class="the-input">{{house | titlecase}}</md-option>
                            </md-select>
                            <button md-raised-button type="button" class="configure-house-btn" (click)="getRepSlotsForHouse(chooseHouseForm)" >GET REPRESENTATIVE SLOTS</button>
                        </form>
                    </div>
                    <div *ngIf="showChooseFromHouseSlotsForm">
                    <form [formGroup]="chooseFromHouseSlotsForm">
                            <md-select class="choose-house-select" placeholder="Choose a {{houseDesignation | titlecase}}" formControlName="slotName">
                                    <md-option *ngFor="let slot of houseSlots" [value]="slot"  class="the-input">{{slot | titlecase}}</md-option>
                            </md-select>                                                   
                            <button md-raised-button type="button" class="configure-house-btn" (click)="configRep(chooseFromHouseSlotsForm)" >CONFIGURE REPRESENTATIVE</button>
                        </form>
                    </div>
                </div>
                <br>
                <Section>
                    <dynamic-form [config]="houseConfig" *ngIf="houseConfig.length >= 1"  #form="dynamicForm" (submit)="submit($event)"></dynamic-form>
                </Section>
            </Section> 
            <Section *ngIf="showSubForm">
                <h3>sub gov level</h3>
            </Section>  
            <Section *ngIf="showGrassForm">
                <h3>grassroot level</h3>
            </Section>            
            
        </div>
    `,
    styleUrls:["./dash.sentiment.css"]
})
export class SentimentComponent implements OnInit{
     @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

    chooseHouseForm:FormGroup;
    houseDesignation:string;
    houseSlots:Array<string> = [];
    showChooseFromHouseSlotsForm:boolean = false;
    chooseFromHouseSlotsForm:FormGroup;
    //houseForm:FormGroup
    //subForm:FormGroup
    //grassForm:FormGroup
    processingSubmit:boolean = false;
   
    showTopForm:boolean
    showHouseForm:boolean
    showSubForm:boolean
    showGrassForm:boolean

    showPres:boolean
    showDPres:boolean

    levels:Array<string> = ['Top Level','House Level','Subgovernment Level','Grassroot Level',];
    toplevels:Array<string> = ['President','Deputy President']
    houselevels:Array<string> = []

    presConfig:Array<FieldConfig> = []
    dpresConfig:Array<FieldConfig> = []
    houseConfig:Array<FieldConfig> = []
    

    constructor(private formBuilder:FormBuilder,private dash:DashService,private snackbar:MdSnackBar,
    private chgRef:ChangeDetectorRef){
    }
    
    ngOnInit(){
        this.dash.presidentLevelConfigure().subscribe(d =>{            
            d.config.config.forEach(element => {                
                this.presConfig.push(element)                
            });      
        })
        this.dash.dpresidentLevelConfigure().subscribe(d =>{
            d.config.config.forEach(element => {
                this.dpresConfig.push(element)                       
            });
        })
        this.dash.fetchHouses().subscribe(h =>{           
            h.houses.forEach(e => {
                this.houselevels.push(e)
            });
        })

        this.chooseHouseForm = this.formBuilder.group({
            houseName:['',[Validators.required]]
        })

        this.chooseFromHouseSlotsForm = this.formBuilder.group({
            slotName:['',[Validators.required]]          
        })

    }    

    choiceChange(value:any){
        switch (value) {
            case this.levels[0]:
                    this.showTopForm = true
                    this.showHouseForm = false
                    this.showSubForm = false
                    this.showGrassForm = false
                    this.showPres = false
                    this.showDPres = false
                    this.processingSubmit = false;
                    this.resetHouseConfig()
                    this.chgRef.detectChanges()
                break;
            case this.levels[1]:
                    this.showTopForm = false
                    this.showHouseForm = true
                    this.showSubForm = false
                    this.showGrassForm = false
                    this.showPres = false
                    this.showDPres = false
                    this.processingSubmit = false;
                    this.resetHouseConfig()
                    this.chgRef.detectChanges()
                break;
            case this.levels[2]:
                    this.showTopForm = false
                    this.showHouseForm = false
                    this.showSubForm = true
                    this.showGrassForm = false
                    this.showPres = false
                    this.showDPres = false
                    this.processingSubmit = false;
                    this.resetHouseConfig()
                    this.chgRef.detectChanges()
                break;
            case this.levels[3]:
                    this.showTopForm = false
                    this.showHouseForm = false;
                    this.showSubForm = false
                    this.showGrassForm = true
                    this.showPres = false
                    this.showDPres = false
                    this.processingSubmit = false;
                    this.resetHouseConfig()
                    this.chgRef.detectChanges()
                break;        
            default:
                    this.showTopForm = false
                    this.showHouseForm = false
                    this.showSubForm = false
                    this.showGrassForm = false
                    this.showPres = false
                    this.showDPres = false
                    this.processingSubmit = false;
                    this.resetHouseConfig()
                    this.chgRef.detectChanges()
                break;
        }
    }  
    
    choiceTopChange(value:any){        
        switch (value) {
            case "President":
                this.showPres = true
                this.showDPres = false
                this.processingSubmit = false;
                break;        
            case "Deputy President":
                this.showPres = false
                this.showDPres = true
                this.processingSubmit = false;
                break;
        }
    }    
    submit(value: {[name: string]: any}) {  
          
        this.processingSubmit = true; 
        let count:number = 0;    
        let keys = Object.keys(value.thedata).filter((v)=> {return v !== "api"}).filter((v)=>{return v != "image"})        
        
        keys.forEach(key => {
            let val = value.thedata[key]                
            switch (val) {
                case undefined:
                    let msg:string = "Error: required inputs not entered";
                    this.snackbar.open(msg,"Close",{duration:2500})
                    this.processingSubmit = false;
                    break;            
                default:
                    count++
                    break;
            }
        });
        if (count === keys.length){                    
            Object.getOwnPropertyNames(value.thedata).forEach(element => {                
                if (element === ""){                    
                    delete value.thedata[element]
                }
            });
            let s = new Sentiment()
            s.api = value.forwho
            s.image = value.image
            s.data = value.thedata            
            this.dash.addSentiment(s).subscribe(d => {                
                if(d.status === true){
                    this.processingSubmit = false;                   
                    this.snackbar.open("Sentiment added.","Close",{duration:2500})
                }else if (d.status === false){
                   this.processingSubmit = false;
                   this.snackbar.open("Error occured.","Close",{duration:2500}) 
                }
            })             
        }
    }

    getRepSlotsForHouse(form:any){  
        this.houseConfig.splice(0,this.houseConfig.length)     
        this.dash.getRepSlotsForHouse(form.value).subscribe(d =>{
            this.houseDesignation = d.designation;
            this.houseSlots.splice(0,this.houseSlots.length)
            this.showChooseFromHouseSlotsForm = true;
            this.chgRef.detectChanges()
            d.slots.forEach(e => {
               this.houseSlots.push(e) 
            });
        })
    }

    configRep(form:any){     
        this.houseConfig.splice(0,this.houseConfig.length)     
        let d = new HouseConfig()
        d.designation = this.houseDesignation;
        d.type = 'houseslot'
        d.data = form.value            
        this.dash.configureHouseLevel(d).subscribe(d =>{
            d.config.config.forEach(element => {                
                this.houseConfig.push(element)                
            });                 
        })
    }

    resetHouseConfig(){
        this.houseConfig.splice(0,this.houseConfig.length)
        this.chooseHouseForm.reset()
        this.chooseFromHouseSlotsForm.reset()
    }


}

class Sentiment{
    api:string
    image:string
    data:Object
}

class HouseConfig{
    designation:string
    type:string
    data:any
}