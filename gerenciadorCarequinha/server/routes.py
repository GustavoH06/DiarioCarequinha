from flask import request, jsonify
from models import Alunos, Salas, Competencia

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
            nome_pai1        = data.get('nomePai1') or None,
            nome_pai2        = data.get('nomePai2') or None,
            endereco        = data.get('endereco'),
            numero          = data.get('numero'),
            idade           = data.get('idade'),
            sexo            = data.get('sexo'),
        )

        db.session.add(aluno)
        db.session.commit()
        return jsonify(aluno.to_dict()), 201
    
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
            existente.nota          = data.get('nota')
            existente.observacao    = data.get('observacao')
            db.session.commit()
            return jsonify(existente.to_dict()), 200
        
        comp = Competencia(
            aluno_id    = pid,
            item_id     = data.get('itemId'),
            nota        = data.get('nota'),
            observacao  = data.get('observacao'),
        )

        db.session.add(comp)
        db.session.commit()
        return jsonify(comp.to_dict()), 201

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
            sala.nome               = data.get('nome',      sala.nome)
            sala.tipo               = data.get('tipo',      sala.tipo)
            sala.turno              = data.get('turno',     sala.turno)
            sala.horario_inicio     = data.get('horarioInicio', sala.horario_inicio)
            sala.horario_termino    = data.get('horarioTermino', sala.horario_termino)

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
