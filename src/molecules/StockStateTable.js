import React  from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root : {
        flexGrow:'1',
        padding:'5px',
        borderTop:'1px solid #D1D1D1',
        flexBasis: '33.3%'
    },
    up : {
        color:'#ff4444',
        flexGrow:'1',
        padding:'5px',
        borderTop:'1px solid #D1D1D1',
        flexBasis: '33.3%'
    },
    dn : {
        color:'#17a6ff',
        flexGrow:'1',
        padding:'5px',
        borderTop:'1px solid #D1D1D1',
        flexBasis: '33.3%'
    },
    keep :{
        color:'#606060',
        flexGrow:'1',
        padding:'5px',
        borderTop:'1px solid #D1D1D1',
        flexBasis: '33.3%'
    },
    header:{
        backgroundColor:'#e8e8e8',
        flexGrow:'1',
        color:'black',
        padding:'5px',
        textAlign:'center',
        borderTop:'1px solid #D1D1D1',
        marginTop:'3px',
        flexBasis: '33.3%'
    }
}));

export default function StockStateTable({labels, headerf, up_dn , aligns}){
    const classes = useStyles();
    
    var tclass = ""
    if(headerf)
        tclass = classes.header
    else {
        if(up_dn)
            tclass = classes[up_dn]
        else
            tclass = classes.root
    }
        
    
    var TableItem = labels.map((txt,i)=>{
        var style = {fontSize:'12px'}
        if(aligns) {
            style['textAlign'] = aligns[i] === 'l' ? 'left' : 'right'
        }
        return (
            <div className={tclass} style={style}>
                {txt.split('\n').map(t=>(<div>{t}</div>))}
            </div>
        )
    })

    return (
        <div style={{display:'flex'}}>
            {TableItem}
        </div>
    )
    
}