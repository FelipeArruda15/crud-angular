import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cidade } from '../modelos/Cidade';
import { Estado } from '../modelos/Estado';
import { Pessoa } from '../modelos/Pessoa';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(private http: HttpClient) { }

  alterarCliente(id: number, p: Pessoa): Observable<Pessoa> {
    return this.http.put<Pessoa>(`http://localhost:3000/pessoas/${id}`, p);
  }

  cadastrarCliente(p: Pessoa): Observable<Pessoa> {
    return this.http.post<Pessoa>('http://localhost:3000/pessoas', p);
  }

  listarClientes(): Observable<Pessoa[]> {
    return this.http.get<Pessoa[]>('http://localhost:3000/pessoas');
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`http://localhost:3000/pessoas/${id}`);
  }

  listarCidadesPorEstado(uf: string): Observable<Cidade[]> {
    return this.http.get<Cidade[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`);
  }

  listarEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome');
  }
}
