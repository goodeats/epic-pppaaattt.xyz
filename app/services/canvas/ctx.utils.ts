type ctxProps = {
	ctx: CanvasRenderingContext2D
}

export const ctxBegin = ({ ctx }: ctxProps) => {
	ctx.beginPath()
	ctx.save()
}

export const ctxEnd = ({ ctx }: ctxProps) => {
	ctx.restore()
	ctx.closePath()
}
