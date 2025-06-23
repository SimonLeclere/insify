import { Lightbulb } from "lucide-react";
import React from "react";
import { motion, useInView } from "framer-motion";

import { cn } from "@/lib/utils";

const HINTS = [
	"Vous pouvez accéder à n'importe quelle page et fonctionnalité depuis la barre de recherche.",
	"Personnalisez vos paramètres dans la section dédiée.",
	"Essayez le mode sombre pour un meilleur confort visuel la nuit.",
	"Vous pouvez utiliser les raccourcis clavier pour gagner du temps. Essayez d'appuyer sur 'Ctrl + K' pour ouvrir la recherche.",
	"Vous pouvez exporter vos projets au format PDF depuis la barre latérale.",
	"Consultez la documentation pour découvrir toutes les fonctionnalités.",
	"Vous pouvez désactiver les astuces dans les paramètres.",
	"Maintenez la touche 'Shift' enfoncée pour pour supprimer un projet sans confirmation.",
];

function getRandomHint() {
	return HINTS[Math.floor(Math.random() * HINTS.length)];
}

export function RandomHint() {
	const hint = React.useMemo(() => getRandomHint(), []);
	const splittedText = hint.split(" ");
	const pullupVariant = {
		initial: { y: 20, opacity: 0 },
		animate: (i: number): any => ({
			y: 0,
			opacity: 1,
			transition: {
				delay: i * 0.07,
				type: "spring" as const,
				stiffness: 80,
				damping: 12,
			},
		}),
	};
	const ref = React.useRef(null);
	const isInView = useInView(ref, { once: true });
	return (
		<div
			className="flex items-center justify-center text-muted-foreground italic text-sm gap-2"
			ref={ref}
		>
			<span className="flex flex-wrap gap-y-1 items-center">
				<motion.span
					initial={{ rotate: -10, scale: 0.8, opacity: 0 }}
					animate={isInView ? { rotate: 0, scale: 1, opacity: 1 } : {}}
					transition={{ type: "spring", stiffness: 120, damping: 8 }}
					className="inline-block align-middle pr-1"
				>
					<Lightbulb size={16} className="opacity-70 text-yellow-500" />
				</motion.span>
				<span className="pr-1">Astuce :</span>
				{splittedText.map((word, i) => (
					<motion.span
						key={i}
						variants={pullupVariant}
						initial="initial"
						animate={isInView ? "animate" : ""}
						custom={i}
						className={cn("pr-1")}
					>
						{word === "" ? <span>&nbsp;</span> : word}
					</motion.span>
				))}
			</span>
		</div>
	);
}
