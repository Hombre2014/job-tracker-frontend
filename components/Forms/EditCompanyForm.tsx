'use client';

import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';

import { EditCompanySchema } from '@/schemas';

const EditCompanyForm = () => {
  return (
    <div>
      <h1>Form</h1>
    </div>
  );
};

export default EditCompanyForm;
