import React,{useEffect, useState} from 'react';
import './Mail.css';
import emailjs from '@emailjs/browser';

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

        const templateParams={
            to_email: toEmails.join(', '),
            subject: subject,
            message: body
        };

        emailjs.send(
            import.meta.env.VITE_EMAILJS_SERVICE_ID,
            import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
            templateParams,
            import.meta.env.VITE_EMAILJS_PUBLIC_KEY

        ).then(()=>{
            OnSend({
                type: 'success',
                message: `Mail sent to: ${toEmails.join(', ')}`,
                toEmails,
                subject,
                body
            });
            onClose();
        }).catch((error)=>{
            console.error(error);
            OnSend({type:'error', message: "Failed to send email.Please try again"});
        })

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