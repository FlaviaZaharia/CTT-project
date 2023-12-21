import './ClockHours';
import './clock-hours-container.scss'
import ClockHours from './ClockHours'
import ClockHoursApprove from './ClockHoursApprove';
import { useState } from 'react';
const ClockHoursContainer=()=>{
  const [submit,setSubmit]=useState(true);

    return <div className="ch-cont">
         <h1>Clock Hours</h1>
         <div className="filter">
        <button onClick={() => setSubmit(true)} id={submit?"isSelected":""}>Create Timesheet</button>
        <button onClick={() => setSubmit(false)}  id={!submit?"isSelected":""}>Approve Timesheets</button>
      </div>
      {submit? <ClockHours/>:<ClockHoursApprove/>}
    </div>
}


export default ClockHoursContainer;