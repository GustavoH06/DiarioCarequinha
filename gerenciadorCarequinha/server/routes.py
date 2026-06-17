from flask import request, jsonify
from models import Alunos, Salas, Competencia, Presenca, Desempenho
import csv
import io

def register_routes(app, db):

    @app.route('/api/alunos', methods=['GET', 'POST'])
    def alunos():
        if request.method == 'GET':
            return jsonify([a.to_dict() for a in Alunos.query.all()]), 200

        data = request.get_json()
        aluno = Alunos(
            nome            = data.get('nome'),
            data_nascimento = data.get('dataNascimento'),
            telefone        = data.get('telefone'),
            nome_pai1       = data.get('nomePai1') or None,
            nome_pai2       = data.get('nomePai2') or None,
            endereco        = data.get('endereco'),
            numero          = data.get('numero'),
            sexo            = data.get('sexo'),
        )
        db.session.add(aluno)
        db.session.commit()
        return jsonify(aluno.to_dict()), 201

    def criar_aluno_do_dict(data, erros, idx):
        nome = data.get('nome', '').strip()
        if not nome:
            erros.append(f'Registro {idx+1}: Nome é obrigatório - ignorado')
            return None
        
        data_nascimento = data.get('dataNascimento', '').strip()
        if not data_nascimento:
            erros.append(f'Aluno "{nome}": Data de nascimento é obrigatória - ignorado')
            return None
        
        existing = Alunos.query.filter_by(nome=nome).first()
        if existing:
            erros.append(f'Aluno "{nome}" já existe - ignorado')
            return None
        
        aluno = Alunos(
            nome=nome,
            data_nascimento=data_nascimento,
            telefone=data.get('telefone', '').strip() or None,
            nome_pai1=data.get('nomePai1', '').strip() or None,
            nome_pai2=data.get('nomePai2', '').strip() or None,
            endereco=data.get('endereco', '').strip() or None,
            numero=data.get('numero', '').strip() or None,
            sexo=data.get('sexo', '').strip() or None,
        )
        
        db.session.add(aluno)
        db.session.flush()
        
        sala_nome = data.get('sala', '').strip()
        if sala_nome:
            sala = Salas.query.filter_by(nome=sala_nome).first()
            if sala:
                sala.alunos.append(aluno)
            else:
                erros.append(f'Sala "{sala_nome}" não encontrada para aluno "{aluno.nome}"')
        
        return aluno.to_dict()

    @app.route('/api/alunos/<int:pid>', methods=['GET', 'PUT', 'DELETE'])
    def aluno(pid):
        aluno = Alunos.query.get_or_404(pid)

        if request.method == 'GET':
            return jsonify(aluno.to_dict()), 200

        if request.method == 'PUT':
            data = request.get_json()
            aluno.nome            = data.get('nome',            aluno.nome)
            aluno.data_nascimento = data.get('dataNascimento',  aluno.data_nascimento)
            aluno.telefone        = data.get('telefone',        aluno.telefone)
            aluno.nome_pai1       = data.get('nomePai1',        aluno.nome_pai1)
            aluno.nome_pai2       = data.get('nomePai2',        aluno.nome_pai2)
            aluno.endereco        = data.get('endereco',        aluno.endereco)
            aluno.numero          = data.get('numero',          aluno.numero)
            aluno.idade           = data.get('idade',           aluno.idade)
            aluno.sexo            = data.get('sexo',            aluno.sexo)
            db.session.commit()
            return jsonify(aluno.to_dict()), 200

        db.session.delete(aluno)
        db.session.commit()
        return jsonify({'message': f'Aluno {pid} removido'}), 200

    @app.route('/api/alunos/<int:pid>/competencias', methods=['GET', 'POST'])
    def competencias(pid):
        Alunos.query.get_or_404(pid)

        if request.method == 'GET':
            itens = Competencia.query.filter_by(aluno_id=pid).all()
            return jsonify([c.to_dict() for c in itens]), 200

        data = request.get_json()
        existente = Competencia.query.filter_by(
            aluno_id=pid, item_id=data.get('itemId')
        ).first()

        if existente:
            existente.nota       = data.get('nota')
            existente.observacao = data.get('observacao')
            db.session.commit()
            return jsonify(existente.to_dict()), 200

        comp = Competencia(
            aluno_id   = pid,
            item_id    = data.get('itemId'),
            nota       = data.get('nota'),
            observacao = data.get('observacao'),
        )
        db.session.add(comp)
        db.session.commit()
        return jsonify(comp.to_dict()), 201
    
    @app.route('/api/alunos/bulk', methods=['POST'])
    def bulk_create_alunos():
        if 'file' not in request.files:
            return jsonify({'error': 'Nenhum arquivo enviado'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Nome de arquivo vazio'}), 400
        
        if not (file.filename.endswith('.csv') or file.filename.endswith('.json')):
            return jsonify({'error': 'Formato de arquivo inválido. Use .csv ou .json'}), 400
        
        try:
            content = file.read().decode('utf-8')
            
            alunos_criados = []
            erros = []
            
            if content.strip().startswith('[') or content.strip().startswith('{'):
                import json
                dados = json.loads(content)
                if isinstance(dados, dict):
                    dados = [dados]
                for idx, item in enumerate(dados):
                    try:
                        aluno = criar_aluno_do_dict(item, erros, idx)
                        if aluno:
                            alunos_criados.append(aluno)
                    except Exception as e:
                        erros.append(f'Erro no registro {idx+1}: {str(e)}')
            else:
                csv_reader = csv.DictReader(io.StringIO(content))
                for idx, row in enumerate(csv_reader):
                    try:
                        aluno = criar_aluno_do_dict(row, erros, idx)
                        if aluno:
                            alunos_criados.append(aluno)
                    except Exception as e:
                        erros.append(f'Erro na linha {idx+2}: {str(e)}')
            
            db.session.commit()
            
            return jsonify({
                'message': f'{len(alunos_criados)} alunos importados com sucesso',
                'alunos': alunos_criados,
                'erros': erros,
                'total_criados': len(alunos_criados),
                'total_erros': len(erros)
            }), 201
            
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500

    @app.route('/api/salas', methods=['GET', 'POST'])
    def salas():
        if request.method == 'GET':
            return jsonify([s.to_dict() for s in Salas.query.all()]), 200

        data = request.get_json()
        sala = Salas(
            nome            = data.get('nome'),
            tipo            = data.get('tipo'),
            turno           = data.get('turno'),
            horario_inicio  = data.get('horarioInicio'),
            horario_termino = data.get('horarioTermino'),
        )
        for pid in data.get('alunoIds', []):
            aluno = Alunos.query.get(pid)
            if aluno:
                sala.alunos.append(aluno)

        db.session.add(sala)
        db.session.commit()
        return jsonify(sala.to_dict()), 201

    @app.route('/api/salas/<int:sid>', methods=['GET', 'PUT', 'DELETE'])
    def sala(sid):
        sala = Salas.query.get_or_404(sid)

        if request.method == 'GET':
            return jsonify(sala.to_dict()), 200

        if request.method == 'PUT':
            data = request.get_json()
            sala.nome            = data.get('nome',            sala.nome)
            sala.tipo            = data.get('tipo',            sala.tipo)
            sala.turno           = data.get('turno',           sala.turno)
            sala.horario_inicio  = data.get('horarioInicio',   sala.horario_inicio)
            sala.horario_termino = data.get('horarioTermino',  sala.horario_termino)
            db.session.commit()
            return jsonify(sala.to_dict()), 200

        db.session.delete(sala)
        db.session.commit()
        return jsonify({'message': f'Sala {sid} removida'}), 200

    @app.route('/api/salas/<int:sid>/alunos/<int:pid>', methods=['POST', 'DELETE'])
    def sala_aluno(sid, pid):
        sala  = Salas.query.get_or_404(sid)
        aluno = Alunos.query.get_or_404(pid)

        if request.method == 'POST':
            if aluno not in sala.alunos:
                sala.alunos.append(aluno)
                db.session.commit()
            return jsonify(sala.to_dict()), 200

        if aluno in sala.alunos:
            sala.alunos.remove(aluno)
            db.session.commit()
        return jsonify(sala.to_dict()), 200

    @app.route('/api/salas/<int:sid>/presencas', methods=['GET'])
    def listar_presencas(sid):
        sala = Salas.query.get_or_404(sid)

        registros = Presenca.query.filter_by(sala_id=sid).all()

        por_aluno = {}
        for r in registros:
            por_aluno.setdefault(r.aluno_id, []).append(r)

        resultado = []
        for aluno in sala.alunos:
            regs = por_aluno.get(aluno.pid, [])
            total = len(regs)
            faltas_regs = [r for r in regs if not r.presente]
            faltas = len(faltas_regs)
            presencas = total - faltas
            frequencia = round((presencas / total) * 100, 1) if total > 0 else 100.0

            resultado.append({
                'alunoId':       aluno.pid,
                'nome':          aluno.nome,
                'totalAulas':    total,
                'faltas':        faltas,
                'frequencia':    frequencia,
                'diasFalta':     sorted(r.data for r in faltas_regs),
                'registros':     [r.to_dict() for r in sorted(regs, key=lambda x: x.data)],
            })

        return jsonify(resultado), 200

    @app.route('/api/salas/<int:sid>/presencas', methods=['POST'])
    def registrar_presenca(sid):
        Salas.query.get_or_404(sid)
        data_req = request.get_json()

        aluno_id = data_req.get('alunoId')
        data_str = data_req.get('data')
        presente = data_req.get('presente')

        Alunos.query.get_or_404(aluno_id)

        existente = Presenca.query.filter_by(
            aluno_id=aluno_id, sala_id=sid, data=data_str
        ).first()

        if existente:
            existente.presente = presente
            db.session.commit()
            return jsonify(existente.to_dict()), 200

        registro = Presenca(
            aluno_id = aluno_id,
            sala_id  = sid,
            data     = data_str,
            presente = presente,
        )
        db.session.add(registro)
        db.session.commit()
        return jsonify(registro.to_dict()), 201

    @app.route('/api/salas/<int:sid>/presencas/<int:registro_id>', methods=['DELETE'])
    def remover_presenca(sid, registro_id):
        registro = Presenca.query.get_or_404(registro_id)
        if registro.sala_id != sid:
            return jsonify({'message': 'Registro não pertence a esta sala'}), 400

        db.session.delete(registro)
        db.session.commit()
        return jsonify({'message': f'Registro {registro_id} removido'}), 200

    @app.route('/api/alunos/salas/<int:sid>/alunos/<int:pid>', methods=['POST'])
    def add_aluno_to_sala_direct(sid, pid):
        sala = Salas.query.get_or_404(sid)
        aluno = Alunos.query.get_or_404(pid)
        
        if aluno not in sala.alunos:
            sala.alunos.append(aluno)
            db.session.commit()
        
        return jsonify(aluno.to_dict()), 200

    @app.route('/api/alunos/<int:pid>/notas', methods=['PUT'])
    def atualizar_notas_aluno(pid):
        aluno = Alunos.query.get_or_404(pid)
        data = request.get_json()
        
        aluno.notas = data.get('notas', '')
        db.session.commit()
        
        return jsonify(aluno.to_dict()), 200

    @app.route('/api/alunos/<int:pid>/desempenho', methods=['POST'])
    def salvar_desempenho(pid):
        Alunos.query.get_or_404(pid)
        data = request.get_json()
        
        item_id = data.get('itemId')
        periodo = data.get('periodo')
        valor = data.get('valor')
        
        existente = Desempenho.query.filter_by(
            aluno_id=pid, item_id=item_id
        ).first()
        
        if existente:
            if periodo == 'periodo1':
                existente.periodo1 = valor
            elif periodo == 'periodo2':
                existente.periodo2 = valor
            elif periodo == 'periodo3':
                existente.periodo3 = valor
            db.session.commit()
            return jsonify(existente.to_dict()), 200
        
        novo = Desempenho(
            aluno_id=pid,
            item_id=item_id,
            periodo1=valor if periodo == 'periodo1' else None,
            periodo2=valor if periodo == 'periodo2' else None,
            periodo3=valor if periodo == 'periodo3' else None,
        )
        db.session.add(novo)
        db.session.commit()
        return jsonify(novo.to_dict()), 201
    
    @app.route('/api/salas/<int:sid>/notas', methods=['PUT'])
    def atualizar_notas_sala(sid):
        sala = Salas.query.get_or_404(sid)
        data = request.get_json()
        
        sala.notas = data.get('notas', '')
        db.session.commit()
        
        return jsonify(sala.to_dict()), 200