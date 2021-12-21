import date from 'date-and-time';
import moment from 'moment'

export const renderDate = (mydate)=>{
    const now = new Date();
    let today = date.format(now, 'DD/MM/YY');  
    let Yesterday = date.addDays(now, -1);
    Yesterday = date.format(Yesterday,'DD/MM/YY');
    let notificationDate = moment.parseZone(mydate).local().format("DD/MM/YY")
    if(notificationDate===today){
        return "Today"
    }else if (notificationDate===Yesterday){
        return "Yesterday"
    }else{
        return notificationDate
    }
}