import React,{useEffect, useState} from 'react';
import './Mail.css';

const Mail=({isOpen, onClose, toEmails, OnSend})=>{
    const[subject, setSubject]= useState('');
    const [body, setBody]= useState('');

    useEffect(()=>{
        if(isOpen){
            setSubject('');
            setBody('');
        }
    },[isOpen]);

    if(!isOpen) return null;


    const handleSend=()=>{
        if(!subject || !body){
            OnSend({type: 'error', message:"Please fill all the fields"});
            return;
        }

        OnSend({
            type:'success',
            message:`Mail Sent to: ${toEmails.join(', ')}`,
            toEmails,
            subject,
            body
        });
        onClose();
    };


    return(
        <div className="mail-overlay">
            <div className="mail-box">
                <h2>Send Mail</h2>


                <label>To:</label>
                <input
                    type="text"
                    className="input-small"
                    value={toEmails.join(', ')}
                    readOnly
                />


                <label>Subject:</label>
                <input
                type="text"
                className="input-small"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                />

                <label>Body:</label>
                <textarea
                className="input-large"
                rows="5"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                ></textarea>

                <div className="mail-buttons">
                    <button onClick={handleSend}>Send</button>
                    <button onClick={onClose}>Cancel</button>
                </div>

            </div>
        </div>
    );
};

export default Mail;