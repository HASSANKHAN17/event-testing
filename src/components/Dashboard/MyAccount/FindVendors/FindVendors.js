import React from 'react'
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Dashhead from '../../Dashhead/Dashhead'
import axios from 'axios'
import "./FindVendors.scss"
import {connect} from 'react-redux'
import Rating from '@mui/material/Rating'
import TextField from '@mui/material/TextField'

function FindVendors(props) {
    const [display,setDisplay]=React.useState(false);
    const [data,setData]=React.useState([])
    const [filtered,setFiltered]=React.useState([])
    React.useEffect(()=>{
        axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/user/search`,{query:"aurangabad"},{headers:{token:props.user.user}})
        .then(res=>{
            console.log(res)
            if(res.data.result.length>0){
                setData(res.data.result)
            }
        })
        .catch(err=>{
            console.log(err);
        })

    },[])
    const setSearchResult=(e)=>{
        let array = data.filter(item=>{
          //console.log(item)
          let name = item.name.slice(0,e.length).trim().replace(' ','').toLowerCase();
          let serachname = e.toLowerCase().replace(' ','').trim();
          if(name===serachname){
            return item;
          }
        })
        setFiltered(array)
      }
    console.log(data,props);
    return (
        <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <Dashhead id={6} display={display} />
        </div>

        <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 dashboard-container">
            <span className="iconbutton">
        <IconButton  size="large" aria-label="Menu" onClick={()=>setDisplay(true)}>
        <MenuIcon fontSize="inherit" />
         </IconButton>
         </span>

        <div onClick={()=>setDisplay(false)}>
   <h1 className="mt-4">Showing vendors in Aurangabad</h1>
            <TextField sx={{width:'30vw'}} 
            onChange={(e)=>setSearchResult(e.target.value)}
            className="my-3"
            id="filled-basic" label="Search vendor by city" variant="filled" />
   <div className="row bid-parent">
        {
            data.length>0 && filtered.length<=0?(
                data.map((item,index)=>(
                    <div className="shadow-sm col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 mx-5 bid-parent-container" key={index}>
                        <div className="">
                        <div className="row justify-content-between">
                        <h3 className="name col-9">{item.name}</h3>
                        </div>

                        <p className="for">for <span>{item.organisation}</span></p>
                        {item.rating?<Rating
                    readOnly 
                        name="read-only"
                        value={item.rating.avg}
                        
                      />:null}
                        <p className="for">{item.email}</p>

                        {
                            item.user_services.map((service,sindex)=>(
                                <div key={sindex} className="row shadow-sm services-container">
                                    <div className="col-1">
                                    <p className="index">{sindex+1}</p>
                                    </div>

                                    <div className="col-7">
                                    <p className="service-subcat">{service.subCategory}</p>
                                    <p className="service-cat">{service.category}</p>
                                    </div>

                                    <div className="col-3">
                                    <p className="service-price">${service.price}</p>
                                    <p className="service-quantity">{service.quantity}</p>
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                ))
            ):null
        }
        {
            filtered.length>0?(
                filtered.map((item,index)=>(
                    <div className="shadow-sm col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3 mx-5 bid-parent-container" key={index}>
                        <div className="">
                        <div className="row justify-content-between">
                        <h3 className="name col-9">{item.name}</h3>
                        </div>

                        <p className="for">for <span>{item.organisation}</span></p>
                        {item.rating?<Rating
                    readOnly 
                        name="read-only"
                        value={item.rating.avg}
                        
                      />:null}
                        <p className="for">{item.email}</p>

                        {
                            item.user_services.map((service,sindex)=>(
                                <div key={sindex} className="row shadow-sm services-container">
                                    <div className="col-1">
                                    <p className="index">{sindex+1}</p>
                                    </div>

                                    <div className="col-7">
                                    <p className="service-subcat">{service.subCategory}</p>
                                    <p className="service-cat">{service.category}</p>
                                    </div>

                                    <div className="col-3">
                                    <p className="service-price">${service.price}</p>
                                    <p className="service-quantity">{service.quantity}</p>
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                ))
            ):null
        }
        </div>


            {/* end of block */}
        </div>
        </div>
    </div>
    )
}

const mapStateToProps =({EventUser})=>{
    return{
        user:EventUser
    }
}

export default connect(mapStateToProps)(FindVendors)