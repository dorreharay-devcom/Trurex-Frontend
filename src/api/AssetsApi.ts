import { Backend } from '~/services/AuthService';
import { Asset } from '~/types/app';
import {
  terminateIfUnauthorizedRequestError,
  toastIfAccountFrozenMutationError,
} from '~/utils/mutationRestrictionError';

export const AssetsApi = {
  getAssets: async (): Promise<Asset[]> => {
    const { data, error } = await Backend.from('assets').select('*');
    if (error) {
      terminateIfUnauthorizedRequestError(error);
      toastIfAccountFrozenMutationError(error);
      throw new Error(error.message);
    }
    return data;
  },

  getAssetById: async (id: string): Promise<Asset> => {
    const { data, error } = await Backend.from('assets').select('*').eq('id', id).single();
    if (error) {
      terminateIfUnauthorizedRequestError(error);
      toastIfAccountFrozenMutationError(error);
      throw new Error(error.message);
    }
    return data;
  },

  createAsset: async (asset: Partial<Asset>) => {
    const { data, error } = await Backend.from('assets').insert(asset).select().single();
    if (error) {
      terminateIfUnauthorizedRequestError(error);
      toastIfAccountFrozenMutationError(error);
      throw new Error(error.message);
    }
    return data;
  },
};
