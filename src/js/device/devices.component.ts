import { Component, OnInit, Input, Output } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { ActivatedRoute, Params }   from '@angular/router';
import { NgForm } from '@angular/forms';

import {Device} from './device';
import {DeviceService} from './device.service';

var $ = require('jquery');
require('bootstrap');


@Component({
    selector: 'devices',
    templateUrl: './devices.component.html'
})
export class DevicesComponent implements OnInit {
    params:any = {};
    public devices: Device[];
    public recordCount:number;
    public pageSize:number = 10;
    public pageIndex:number = 1;
    public searchWord:string="";

    public SelectedDevice:Device = new Device;

    constructor( private http:Http, private service:DeviceService,private route: ActivatedRoute) {
    }
    
    search() {
        this.pageIndex=1;
        var opt = {pagesize:this.pageSize, pageindex:this.pageIndex, keyword:this.searchWord};
        _.extend(opt, this.params);
        this.service.page(opt)
            .then( res => {
                    this.devices = res.json().result as Device[];
                    this.recordCount = res.json().total;
            }).catch(err => console.log(err.message || err))
    }
    
    remove(device:Device, evt:any) {
        this.service.delete(device.id).then(res => {
            var ret = res.json();
            if(ret.code === 'success') {
                this.devices = _.reject(this.devices, (each) => {
                    return each.id === device.id;
                })
            } else {
              this.popBy(evt.target, ret.message,'');  
            }
            
        }).catch(err => {
            console.log(err.message || err)
            this.popBy('#btnCreate', err.message,'');
        })
    }

    popBy(obj:string, message:string, direct:string) {
        $(obj).popover('destroy');
        $(obj).popover({
            placement: direct ||'bottom',
            trigger: 'manual',
            content: message,
            container: 'body'
        });
    
        clearTimeout($(obj).data('timeout1986'));
        $(obj).popover('show');
        var timeout = setTimeout(function () { $(obj).popover('hide'); }, 3000);
        $(obj).data('timeout1986',timeout);
    }
    
    
    openDialog() {
        this.SelectedDevice = new Device;
        $('#modalCreate').modal('show');
    }
    create(form:NgForm, btn:any) {
        if(form.invalid) {
            return false;
        }
        var _this = this;
        this.service.create(this.SelectedDevice).then(res => {
            var ret = res.json();
            if(ret.code==='success') {
                _this.devices.unshift(ret.result as Device);
                btn.click();
            } else {
                _this.popBy('#btnCreate', ret.message,'');
            }
        }).catch(err=> {
            _this.popBy('#btnCreate', err.message,'');
        });
    }
    
    pageChange(pageIndex:number) {
        this.pageIndex = pageIndex;
        this.service.page({pagesize:this.pageSize, pageindex:pageIndex, keyword:this.searchWord})
            .then( res => {
                this.devices = res.json().result as Device[];
                this.recordCount = res.json().total;
            })
            .catch(err => console.log(err.message || err))
    }
    
    ngOnInit(): void {
        this.route.params.forEach( (param:Params) => {
            _.extend(this.params, param);
        });
        
        var opt = {pagesize:this.pageSize, pageindex:this.pageIndex};
        _.extend(opt, this.params);
        this.service.page(opt)
            .then( res => {
                this.devices = res.json().result as  Device[];
                this.recordCount = res.json().total;
            })
            .catch(err => console.log(err.message || err))
        }
}