import Popover from '../popover';
import Table from '../table';
import Tabs from '../tabs';
import Map from '../map';
import DragDrop from './dragdrop';
import LayerProperty from '../layerproperty';
import Style from '../style'
import Layer from '../layer';
import Modal from '../modal';
export default class MapLayer extends Map {
    constructor(options) {
        super(options)
        const layers = this.layers = options.layers || {};
        this.dragdrop = (typeof options.dragdrop == 'undefined') ? true : options.dragdrop;
        
        
        this.styles = options.styles || {
            default: new Style()
        }

        const datamodal = this.datamodal = new Modal({
            title:'MyModal',
            body:this.createTable()
        })

        const popover = this.popover = new Popover({
            // isheader:false,
            title: "Data",
            width: 400,
            height: 400,
        });


        const self = this;
        this.lp = new LayerProperty({
            // isheader:false,
            _map: () => self,
            title: "Layer",
            width: 400,
            height: 400,
        })
        
        this.table = this.createTable()
        this.mcatable = this.createTable()



    }
    render(parent) {
        super.render(parent);
        const { dragdrop } = this;
        this.parent = parent;
        const popovercontent = this.popover.render(parent);
        
        const tabs =this.tabs= new Tabs({
                tabs:{
                  gis:{title:'GIS',active:true,content:this.table},
                  mca:{title:'MCA',active:false,content:this.mcatable},
                }
            });
        tabs.render(popovercontent);
        
        this.datamodal.render();
        

        // this.table.render(popovercontent);
        if (dragdrop) this.addDragDrop();

        this.lp.render(parent);
    }
    addLayer(name,data) {
        const layer = new Layer({id:name,name:name,isOn:true,source:{ type: 'geojson', data: data }})
        super.addLayer(layer);
        this.layers[layer.id] = layer;
        this.table.addRow(layer.row);
    }
    addDragDrop() {
        const self = this;
        const dragdrop = this.dragdrop = new DragDrop({
            callback:(name,data)=>self.addLayer(name,data)
        });
        dragdrop.render(this.element);
    }
    showhideLayer(id) {
        this.layers[id].isOn = !this.layers[id].isOn;
        this.refresh(id);
    }
    refresh(id) {
        this.layers[id].getpossiblelayers(this.layers[id].type).forEach(layerid => super.showhideMapboxGL(id + "-" + layerid, false))
        if (this.layers[id].isOn) {
            this.layers[id].getOnmapboxlayers().forEach(layerid => super.showhideMapboxGL(id + "-" + layerid, true))
        }
    }
    
    createTable(){
        const self=this;
        return new Table({
            header: `<thead>
            <tr>
                <th>Name</th>
                <th>on/off</th>
                <th>Type</th>
                <th>Properties</th>
            </tr>
        </thead>`,
            data: {},
            isfilterbtn:true,
            columns: {
                name:{ title: "Name", type: 'string',isOn:true },
                isOn:{ title: "on/off", type: 'check',isOn:true, callback: (id) => self.showhideLayer(id) },
                type:{ title: "Type", type: 'string',isOn:true },
                properties:{ title: "Properties", type: 'popover',isOn:true, callback: (id) => self.lp.show(id) },
            },
            btns:{ 
                add:{title:'Add',icon:'fas fa-plus-circle',callback:()=>{console.log('add');self.datamodal.show()}}
            }


        });
        
    }


}
