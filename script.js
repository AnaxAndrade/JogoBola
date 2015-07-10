 //variaveis do jogo
var canvas, ctx, ALTURA, LARGURA, frames = 0,
	maxPulos = 100,
	velocidade = 6,
	estadoAtual,

	estados = {
		jogar: 0,
		jogando: 1,
		perdeu: 2
	},
	chao = {
		y: 550,
		altura: 50,
		cor: "#ffdf70",
		desenha: function() {
			ctx.fillStyle = this.cor;
			ctx.fillRect(0, this.y, LARGURA, this.altura);
		}
	},

	bloco = {
		x: 50,
		y: 0,
		altura: 20,
		largura: 20,
		cor: "#ff4e4e",
		gravidade: 1.6,
		velocidade: 0,
		forcaDoPulo: 23.6,
		qntPulos: 0,
		score: 0,

		atualiza: function() {
			this.velocidade += this.gravidade;
			this.y += this.velocidade;

			if (this.y > chao.y - this.altura && estadoAtual != estados.perdeu) {
				this.y = chao.y - this.altura;
				this.qntPulos = 0;
				this.velocidade = 0;
			}
		},

		pula: function() {
			if (this.qntPulos < maxPulos) {
				this.velocidade = -this.forcaDoPulo;
				this.qntPulos++;
			}
		},

		reset: function() {
			this.velocidade = 0;
			this.y = 0;
			this.score = 0;

		},

		desenha: function() {
			ctx.beginPath();
			ctx.fillStyle = this.cor;
			ctx.arc(this.x, this.y, 20, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.stroke();
		}
	},
	obstaculos = {
		_obs: [],
		cores: ["#ffbc1c", "#ff1c1c", "#ff85e1", "#52a7ff", "#78ff5d"],
		tempoInsere: 0,

		// Insere as bolas o chao da tela
		insere: function() {
			this._obs.push({
				x: LARGURA,
				largura: 50,
				altura: 25,
				cor: this.cores[Math.floor(5 * Math.random())]
			});

			this.tempoInsere = 20 + Math.floor(21 * Math.random());
		},

		atualiza: function() {
			if (this.tempoInsere == 0)
				this.insere();
			else
				this.tempoInsere--;

			for (var i = 0, tamanho = this._obs.length; i < tamanho; i++) {
				var obs = this._obs[i];

				obs.x -= velocidade;
				if (bloco.x < obs.x + obs.largura && bloco.x + bloco.largura >= obs.x && bloco.y + bloco.altura >= chao.y - obs.altura)
					estadoAtual = estados.perdeu;

				else if (obs.x == 0)
					bloco.score++;

				if (obs.x <= -obs.largura) {
					this._obs.splice(i, 1);
					tamanho--;
					i--;
				}
			}

		},

		limpa: function() {
			this._obs = [];

		},

		desenha: function() {
			for (var i = 0, tamanho = this._obs.length; i < tamanho; i++) {
				var obs = this._obs[i];
				ctx.beginPath();
				ctx.fillStyle = this.cor;
				ctx.arc(obs.x, chao.y - obs.altura, 25, obs.altura, 0, 2 * Math.PI);
				ctx.fill();
				ctx.stroke();
			}

		}

	};

function clique(event) {

	if (estadoAtual == estados.jogando)
		bloco.pula();
	else if (estadoAtual == estados.jogar) {
		estadoAtual = estados.jogando;
	} else if (estadoAtual == estados.perdeu && bloco.y >= 2 * ALTURA) {
		estadoAtual = estados.jogar;
		obstaculos.limpa();
		bloco.y = 0;
		bloco.reset();
	}
}

function main() {
	ALTURA = window.innerHeight;
	LARGURA = window.innerWidth;
	/* Cria html element canvas */
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");

	/* Adiciona event */
	document.addEventListener("mousedown", clique);

estadoAtual = estados.jogar;
	roda();

}

function roda() {
	atualiza();
	desenha();
	window.requestAnimationFrame(roda);
}

function atualiza() {
	//frames++;

	bloco.atualiza();
	if (estadoAtual == estados.jogando)
		obstaculos.atualiza();
}

function desenha() {
	ctx.fillStyle = "#50beff";
	ctx.fillRect(0, 0, LARGURA, ALTURA);

	/* Placar texto */
	ctx.fillStyle = "#fff";
	ctx.font = "30px Arial";
	ctx.fillText("Pontuação: "+bloco.score, 30, 68);

	if (estadoAtual == estados.perdeu) {
		ctx.save();
		ctx.translate(LARGURA / 2, ALTURA / 2);
		ctx.fillStyle = "#fff";

		if (bloco.score < 10)
			ctx.fillText(bloco.score, -13, 19)

		else if (bloco.score >= 10 && bloco.score < 100)
			ctx.fillText(bloco.score, -26, 19);
		else
			ctx.fillText(bloco.score, -39, 19);

		ctx.restore();
	} else if (estadoAtual == estados.jogando)
		chao.desenha();

	obstaculos.desenha();
	bloco.desenha();
}

window.onload = function ()
{
	//inicializa o jogo
	main();
}