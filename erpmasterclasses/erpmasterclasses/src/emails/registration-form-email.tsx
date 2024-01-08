import React from 'react';
import { RegistrationFormProps } from '@/../typings'

const RegistrationFormEmail: React.FC<Readonly<RegistrationFormProps>> = ({
    _id,
    companyName,
    address,
    country,
    nameParticipant,
    phone,
    email,
    position,
    vatNumber,
    poNumber,
    additionalParticipants,
}) => (
    <div>
        <h1>Registration form submission</h1>
        <p>Company Name: <strong>{companyName}</strong></p>
        <p>Address: <strong>{address}</strong></p>
        <p>Country: <strong>{country}</strong></p>
        <p>From <strong>{nameParticipant}</strong> ({email})</p>
        <p>Phone: <strong>{phone}</strong></p>
        <p>Position: <strong>{position}</strong></p>
        <p>VAT Number: <strong>{vatNumber}</strong></p>
        <p>PO Number: <strong>{poNumber}</strong></p>
        <h2>Additional Contacts (total {additionalParticipants?.length}):</h2>
        {additionalParticipants?.map((contact, index) => (
            <div key={index}>
                <p>From <strong>{contact.nameParticipant}</strong> ({contact.email})</p>
            </div>
        ))}
    </div>
)

export default RegistrationFormEmail