import { ICommonModalProps } from "@/constants/@types/props/commonModal.props";

const CommonModal = ({
	children,
	onClose,
	isOpen,
	maxWidth = 720
}: ICommonModalProps) => {
	if (!isOpen) return null;

	return (
		<div
			onClick={onClose}
			className="absolute inset-0 z-40 flex items-center justify-center"
		>
			{/* 🔥 BLUR OVERLAY */}
			<div
				className="
					absolute inset-0
					bg-black/30
					backdrop-blur-md
				"
			/>

			{/* Modal */}
			<div
				onClick={(e) => e.stopPropagation()}
				className="
					relative
					w-[90%]
					max-w-[720px]
					rounded-2xl
					bg-white
					p-6
					shadow-2xl
				"
			>
				{children}
			</div>
		</div>
	);
};

export default CommonModal;
