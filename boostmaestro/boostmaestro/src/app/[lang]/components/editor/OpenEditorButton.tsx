"use client"

import React from 'react';
import { Locale } from '@../../../i18n.config';
import { useSession } from 'next-auth/react';
import { Pencil } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/app/[lang]/components/ui/dialog";
import EditorWrapper from '@/app/[lang]/components/editor/EditorWrapper';

function OpenEditorButton({ initialLocale, documentId, className }: { initialLocale: Locale, documentId: string, className?: string }) {
    const { data: session } = useSession();

    return session && (
        <Dialog>
            <DialogTrigger asChild>
                <div className="absolute rounded-md inset-0 bg-gray-200 bg-opacity-0 group-hover:bg-opacity-50 flex justify-center items-center cursor-pointer transition-opacity duration-300">
                    <span className="hidden group-hover:flex items-center text-primary text-lg font-bold">
                        <Pencil className="w-5 h-5" />
                        <span className="ml-2">Edit</span>
                    </span>
                </div>
            </DialogTrigger>
            <DialogContent className='w-full h-full sm:h-fit sm:max-h-[70vh] max-w-5xl p-4 bg-white rounded-none sm:rounded-lg shadow-none sm:shadow-lg overflow-auto'>
                <EditorWrapper
                    documentId={documentId}
                    initialLocale={initialLocale}
                    className={className}
                />
            </DialogContent>
        </Dialog>
    );
}

export default OpenEditorButton;
