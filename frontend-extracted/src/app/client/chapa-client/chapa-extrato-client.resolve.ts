import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";

import { Observable } from 'rxjs';
import { MessageService } from '@cau/message';
import { ChapaEleicaoClientService } from './chapa-eleicao-client.service';

/**
 * Classe resolve responsável pela busca de dados do Extrato de Chapas.
 *
 * @author Squadra Tecnologia
 */
@Injectable({
    providedIn: 'root'
})
export class ChapasExtratoClientResolve implements Resolve<any> {

    /**
     * Construtor da classe.
     *
     * @param router
     * @param messageService
     * @param corpoEmailService
     */
    constructor(
        private router: Router,
        private messageService: MessageService,
        private chapaEleicaoService: ChapaEleicaoClientService
    ) { }

    /**
     * @param route
     */
    public resolve(route: ActivatedRouteSnapshot): Observable<any> {
        let idCauUf = route.params['idCauUf'];

        return  new Observable(observer => {
            let idCauUf = route.params['idCauUf'];
            this.chapaEleicaoService.getDadosExtratoChapa(idCauUf).subscribe(
                data => {
                    observer.next(data);
                    observer.complete();
                },
                error => {
                    observer.error(error);
                    this.router.navigate([""]);
                    this.messageService.addMsgDanger(error);
                    this.messageService.addMsgDanger('MSG_ERRO_COMUNICACAO_TENTE_MAIS_TARDE');
                }
            );
        });       
    }

}