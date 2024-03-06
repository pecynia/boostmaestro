import React, { useState, useEffect } from 'react';
import { Locale, i18n } from '../../../../../i18n.config';
import LocaleIcons from '@/app/[lang]/components/lang/LocaleIcon';
import Image from 'next/image';
import { motion } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/app/[lang]/components/ui/select";

interface EditorLocaleSwitcherProps {
  currentLocale: Locale;
  onLocaleChange: (newLocale: Locale) => void;
}

const EditorLocaleSwitcher: React.FC<EditorLocaleSwitcherProps> = ({ currentLocale, onLocaleChange }) => {
    const [selectedLocale, setSelectedLocale] = useState(currentLocale);

  useEffect(() => {
    setSelectedLocale(currentLocale);
  }, [currentLocale]);

  return (
    <div className=''>
      <div className='flex items-center px-2 py-2'>
        <p className='text-md font-light mr-2'>Selected language</p>
        <Select value={currentLocale} onValueChange={onLocaleChange}>
          <SelectTrigger className="w-[150px] flex items-center justify-between">
            <SelectValue>
              <div className="flex items-center">
                <Image
                  alt={selectedLocale.toUpperCase()}
                  src={LocaleIcons[selectedLocale]}
                  width={24}
                  height={24}
                  className="mr-2"
                />
                {selectedLocale.toUpperCase()}
              </div>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Languages</SelectLabel>
              {i18n.locales.map((loc) => (
                <SelectItem
                  key={loc}
                  value={loc}
                  disabled={loc === selectedLocale}
                >
                  <motion.div layout
                    initial={{ opacity: 0, y: '-10%' }}
                    animate={{ opacity: 1, y: '0%' }}
                    transition={{
                      delay: 0.1,
                      ease: "easeInOut",
                      duration: 0.2
                    }}
                    className="flex items-center">
                    <Image
                        alt={loc.toUpperCase()}
                        src={LocaleIcons[loc]}
                        width={24}
                        height={24}
                        className="mr-2"
                    />
                    {loc.toUpperCase()}
                  </motion.div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default EditorLocaleSwitcher;
