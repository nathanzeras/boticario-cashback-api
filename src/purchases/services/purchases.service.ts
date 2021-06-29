import PurchasesDao from '../../purchases/daos/purchases.dao';
import { CRUD } from '../../common/interfaces/crud.interface';
import { CreatePurchaseDto } from '../../purchases/dto/create.purchase.dto';
import { PutPurchaseDto } from '../dto/put.purchase.dto';
import { PatchPurchaseDto } from '../dto/patch.purchase.dto';
import config from '../../config/config';
import calculateCashback from '../../common/services/cashback.service';
import fetch from 'node-fetch'

class PurchasesService implements CRUD {

  async create(resource: CreatePurchaseDto) {

    calculateCashback(resource);

    if (resource.cpf == config.rootReseller) {
      resource.status = "Aprovado";
    } else {
      resource.status = "Em validação";
    }

    return PurchasesDao.addPurchase(resource);
  }

  async list(limit: number, page: number) {
    return PurchasesDao.getPurchases(limit, page);
  }

  async putById(id: string, resource: PutPurchaseDto) {

    calculateCashback(resource);

    return PurchasesDao.updatePurchaseById(id, resource);
  }

  async patchById(id: string, resource: PatchPurchaseDto) {

    return PurchasesDao.updatePurchaseById(id, resource);
  }

  async deleteById(id: string) {
    return PurchasesDao.removePurchaseById(id);
  }

  async readById(id: string) {
    return PurchasesDao.getPurchaseById(id);
  }

  async getPurchaseStatus(id: string) {
    var status = await PurchasesDao.getPurchaseStatus(id);

    if (status == "Aprovado") {
      return false;
    } else {
      return true;
    }
  }

  async getCashbackExternalApi() {
    const baseUrl = config.apiAccumulateCashback;
    const queryString = '?cpf=12312312323';

    const response = await fetch(baseUrl + queryString, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'token': 'ZXPURQOARHiMc6Y0flhRC1LVlZQVFRnm'
      }
    });

    var data = await response.json();

    return data.body;
  }
}

export default new PurchasesService();