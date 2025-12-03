import { SetMetadata } from '@nestjs/common';

import { IS_PUBLIC_KEY } from '../constants/session';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
