import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Cidade } from '../modelos/Cidade';
import { Estado } from '../modelos/Estado';
import { Pessoa } from '../modelos/Pessoa';
import { ClientesService } from '../servicos/clientes.service';

import emailMask from 'text-mask-addons/dist/emailMask';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {

  emailMask = emailMask;

  clientes: Pessoa[] = [];
  cidades: Cidade[] = [];
  estados: Estado[] = [];
  estadosQuantidade: any[] = [];
  estadosCadastrados: any[] = [];

  //Objeto para manipulação os dados do form
  cliente: Pessoa = new Pessoa();

  btnVisivel: boolean = true;

  indiceCliente: number = -1;

  constructor(private service: ClientesService) { }

  ngOnInit(): void {
    this.listarClientes();
    this.listarEstados();
  }

  formulario = new FormGroup({
    id: new FormControl(),
    nome: new FormControl(),
    email: new FormControl(),
    telefone: new FormControl(),
    estado: new FormControl(),
    cidade: new FormControl()
  })

  alterarCliente() {
    if (!this.jaExiste() || this.nomeIgualAtual()) {
      this.cliente = this.formulario.value;
      let idCliente = this.cliente.id;
      this.service.alterarCliente(idCliente, this.cliente)
        .subscribe(() => this.clientes[this.indicePorId(idCliente)] = this.cliente);
      this.cancelar();
    }
  }

  cadastrar() {
    if (!this.jaExiste()) {

      this.service.cadastrarCliente(this.formulario.value)
        .subscribe(retorno => this.clientes.push(retorno));
    }
    this.cancelar();
  }

  cancelar() {
    this.btnVisivel = true;
    this.formulario.reset();
  }

  enviar() {
    this.cadastrar();
  }

  listarClientes() {
    this.service.listarClientes()
      .subscribe(retorno => this.clientes = retorno);
  }

  listarCidades() {
    this.service.listarCidadesPorEstado(this.formulario.value.estado)
      .subscribe(retorno => this.cidades = retorno);
  }

  listarEstados() {
    this.service.listarEstados()
      .subscribe(retorno => this.estados = retorno);
  }

  indicePorId(id: number) {
    for (let i = 0; i < this.clientes.length; i++) {
      if (this.clientes[i].id == id) {
        return i;
      }
    }
    return -1;
  }

  removerCliente() {
    this.service.remover(this.formulario.value.id)
      .subscribe(() => this.clientes.splice(this.indicePorId(this.formulario.value.id), 1));
    this.cancelar();
  }

  selecionarCliente = async (id: number) => {
    this.btnVisivel = false;

    this.cliente = this.clientes.find(obj => obj.id === id)!;
    this.indiceCliente = this.clientes.findIndex(obj => obj.id === id);

    await this.listarCidadesAlterar();

    this.formulario.setValue(this.cliente);
  }

  listarCidadesAlterar = () => {
    return new Promise((resolve) => {
      this.service.listarCidadesPorEstado(this.cliente.estado)
        .subscribe(retorno => {
          this.cidades = retorno;
          resolve(retorno);
        });
    })
  }

  nomeIgualAtual() {
    let nomeAtual = this.clientes.find(x => x.id == this.formulario.value.id)?.nome;

    if (this.formulario.value.nome == nomeAtual) {
      return true;
    }
    return false;
  }

  jaExiste() {
    let repetido = false;

    for (let i = 0; i < this.clientes.length; i++) {
      if (this.formulario.value.nome == this.clientes[i].nome) {
        repetido = true;
        break;
      }
    }
    return repetido;
  }

  filtrarEstados() {
    this.estadosQuantidade = [];
    this.estadosCadastrados = this.clientes.map(x => x.estado).sort();
    this.estadosCadastrados = [...new Set(this.estadosCadastrados)];

    for (let i = 0; i < this.estadosCadastrados.length; i++) {

      this.estadosQuantidade.push(
        {
          "estado": this.estadosCadastrados[i],
          "quantidade": this.quantidadeCadastrado(this.estadosCadastrados[i])
        });
    }
  }

  quantidadeCadastrado(estado: string) {
    return this.clientes.filter(x => x.estado == estado).length;
  }

  setarCidade(cidade: string) {
    for (let i = 0; i < this.cidades.length; i++) {
      if (this.cidades[i].nome == cidade) {
        return i;
      }
    }
    return 0;
  }
}
