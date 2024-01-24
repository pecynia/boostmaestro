"use client"

import React from 'react'
import { useForm, SubmitHandler, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RegistrationFormSchema, AdditionalRegistrationFormSchema } from '@/lib/schema'
import { sendRegistrationEmail } from '@/app/_actions'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Button } from '@/app/[lang]/components/ui/button'

export type RegistrationFormInputs = z.infer<typeof RegistrationFormSchema>
export type AdditionalParticipantInputs = z.infer<typeof AdditionalRegistrationFormSchema>

export type ClientRegistrationFormProps = {
    localization: {
        companyNamePlaceholder: string
        addressPlaceholder: string
        countryPlaceholder: string
        namePlaceholder: string
        phonePlaceholder: string
        emailPlaceholder: string
        positionPlaceholder: string
        vatPlaceholder: string
        poPlaceholder: string
        submitButtonText: string
        emailSentToast: string
        errorToast: string
        additionalParticipantButton: string
    }
    errorMessages: {
        companyNameRequired: string
        nameRequired: string
        phoneRequired: string
        emailRequired: string
        addressRequired: string
        countryRequired: string
        positionRequired: string
        vatNumberRequired: string
        invalidEmail: string
        messageRequired: string
        messageMinLength: string
    }
}

const ClientRegistrationForm: React.FC<ClientRegistrationFormProps> = ({ localization, errorMessages }) => {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<RegistrationFormInputs>({
        resolver: zodResolver(RegistrationFormSchema)
    })

    const processForm: SubmitHandler<RegistrationFormInputs> = async data => {
        const result = await sendRegistrationEmail(data)

        if (result?.success) {
            toast.success(localization.emailSentToast)
            reset()
        } else {
            console.error(result?.error)
            toast.error(localization.errorToast)
        }
    }

    const { fields, append } = useFieldArray({
        control,
        name: "additionalParticipants"
    })
    const handleAddParticipant = () => {
        append({ nameParticipant: '', email: '' })
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", ease: "easeInOut", duration: 0.5 }}
            viewport={{ once: true }}
            className='min-w-[70%] lg:min-w-[40%] min-h-[20%] max-w-[80%] mb-20 pb-10 flex px-10 pt-4 rounded-xl  bg-white shadow-xl'
        >
            <div className='w-full pt-2'>
                <form onSubmit={handleSubmit(processForm)} className='mx-auto flex flex-1 flex-col gap-4'>
                    {/* Company Name Input */}
                    <input
                        {...register('companyName')}
                        placeholder={localization.companyNamePlaceholder}
                        className='w-1/2 rounded-lg p-2 border-2 border-gray-100'
                    />
                    {errors.companyName && <p className='text-sm text-red-400'>{errorMessages.companyNameRequired}</p>}

                    {/* Name Input */}
                    <input
                        {...register('nameParticipant')}
                        placeholder={localization.namePlaceholder}
                        className='w-1/2 rounded-lg p-2 border-2 border-gray-100'
                    />
                    {errors.nameParticipant && <p className='text-sm text-red-400'>{errorMessages.nameRequired}</p>}

                    {/* Email Input */}
                    <input
                        {...register('email')}
                        placeholder={localization.emailPlaceholder}
                        className='w-2/3 rounded-lg p-2 border-2 border-gray-100'
                    />
                    {errors.email && <p className='text-sm text-red-400'>
                        {errors.email.message === '1' ? errorMessages.emailRequired : errorMessages.invalidEmail}
                    </p>}

                    {/* Address Input */}
                    <input
                        {...register('address')}
                        placeholder={localization.addressPlaceholder}
                        className='w-full rounded-lg p-2 border-2 border-gray-100'
                    />
                    {errors.address && <p className='text-sm text-red-400'>{errorMessages.addressRequired}</p>}

                    {/* Country Input */}
                    <input
                        {...register('country')}
                        placeholder={localization.countryPlaceholder}
                        className='w-full rounded-lg p-2 border-2 border-gray-100'
                    />
                    {errors.country && <p className='text-sm text-red-400'>{errorMessages.countryRequired}</p>}

                    {/* Phone Input */}
                    <input
                        {...register('phone')}
                        placeholder={localization.phonePlaceholder}
                        className='w-full rounded-lg p-2 border-2 border-gray-100'
                    />
                    {errors.phone && <p className='text-sm text-red-400'>{errorMessages.phoneRequired}</p>}

                    {/* Position Input */}
                    <input
                        {...register('position')}
                        placeholder={localization.positionPlaceholder}
                        className='w-full rounded-lg p-2 border-2 border-gray-100'
                    />
                    {errors.position && <p className='text-sm text-red-400'>{errorMessages.positionRequired}</p>}

                    {/* VAT Number Input */}
                    <input
                        {...register('vatNumber')}
                        placeholder={localization.vatPlaceholder}
                        className='w-full rounded-lg p-2 border-2 border-gray-100'
                    />
                    {errors.vatNumber && <p className='text-sm text-red-400'>{errorMessages.vatNumberRequired}</p>}

                    {/* PO Number Input */}
                    <input
                        {...register('poNumber')}
                        placeholder={localization.poPlaceholder}
                        className='w-full rounded-lg p-2 border-2 border-gray-100'
                    />

                    {/* Additional Participants */}
                    {fields.map((field, index) => (
                        <div key={field.id}>
                            <input
                                {...register(`additionalParticipants.${index}.nameParticipant` as const)}
                                placeholder={localization.namePlaceholder}
                                className='w-1/2 rounded-lg p-2 border-2 border-gray-100'
                            />
                            {errors.additionalParticipants && <p className='text-sm text-red-400'>{errorMessages.nameRequired}</p>}
                            <input
                                {...register(`additionalParticipants.${index}.email` as const)}
                                placeholder={localization.emailPlaceholder}
                                className='w-1/2 rounded-lg p-2 border-2 border-gray-100'
                            />
                            {errors.additionalParticipants && <p className='text-sm text-red-400'>
                            {errors.email!.message === '1' ? errorMessages.emailRequired : errorMessages.invalidEmail}
                            </p>}
                        </div>
                    ))}

                    {/* Add Participant Button */}
                    <button type="button" onClick={handleAddParticipant} className='rounded-lg bg-secondary py-2.5 font-medium text-white transition-colors hover:bg-secondary/80'>
                        {localization.additionalParticipantButton}
                    </button>


                    {/* Submit Button */}
                    <button
                        disabled={isSubmitting}
                        className='rounded-lg bg-primary py-2.5 font-medium text-white transition-colors hover:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-50'
                    >
                        {isSubmitting ? 'Sending...' : localization.submitButtonText}
                    </button>
                </form>
            </div>
        </motion.div>
    )
}

export default ClientRegistrationForm
