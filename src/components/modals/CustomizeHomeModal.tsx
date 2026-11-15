import React, { useState, useEffect } from 'react';
import { Account } from '../../types/index.ts';

interface CustomizeHomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Account[];
  onSave: (updatedAccounts: Account[]) => void;
}

export const CustomizeHomeModal: React.FC<CustomizeHomeModalProps> = ({
  isOpen,
  onClose,
  accounts,
  onSave
}) => {
  // Estado local temporal para que los cambios no afecten el home en tiempo real
  const [tempAccounts, setTempAccounts] = useState<Account[]>(accounts);

  // Sincronizar cuentas cada vez que se abra el modal
  useEffect(() => {
    if (isOpen) {
      setTempAccounts(accounts);
    }
  }, [isOpen, accounts]);

  if (!isOpen) return null;

  const handleToggleTempPin = (accountId: string) => {
    setTempAccounts((prev) => {
      const target = prev.find((a) => a.id === accountId);
      if (!target) return prev;
      
      if (!target.isPinned) {
        const pinnedTotal = prev.filter((a) => a.isPinned).length;
        if (pinnedTotal >= 6) {
          alert('Solo puedes fijar un máximo de 6 productos en el Home');
          return prev;
        }
      }
      return prev.map((acc) => (acc.id === accountId ? { ...acc, isPinned: !acc.isPinned } : acc));
    });
  };

  const handleConfirmSave = () => {
    onSave(tempAccounts); // Se actualiza el estado global de la app de golpe
    onClose();
  };

  const pinnedCount = tempAccounts.filter((a) => a.isPinned).length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 flex flex-col gap-4 shadow-2xl max-h-[90vh] overflow-hidden">
        
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-bold text-[#1b1b1c]">Personalizar Inicio</h3>
            <p className="text-[12px] text-[#5b5e66]">Elige qué cuentas deseas ver fijadas ({pinnedCount} de 6 máx.)</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#f6f3f2] flex items-center justify-center text-[#5b5e66]">
            ✕
          </button>
        </div>

        {/* Lista de selección temporal */}
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[50vh] pr-1">
          {tempAccounts.map((acc) => (
            <div
              key={acc.id}
              onClick={() => handleToggleTempPin(acc.id)}
              className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                acc.isPinned ? 'border-[#ec111a] bg-[#ec111a]/5' : 'border-[#e5e7eb] bg-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`material-symbols-outlined text-[20px] ${acc.isPinned ? 'text-[#ec111a]' : 'text-[#5b5e66]'}`}>
                  {acc.isPinned ? 'push_pin' : 'radio_button_unchecked'}
                </span>
                <div>
                  <p className="text-[13px] font-bold text-[#1b1b1c]">{acc.name}</p>
                  <p className="text-[11px] font-mono text-[#5b5e66]">•••• {acc.number}</p>
                </div>
              </div>
              <span className="font-mono text-[12px] font-semibold text-[#1b1b1c]">
                {acc.currencySymbol} {acc.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2 pt-2 border-t border-[#e5e7eb]">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-[#e5e7eb] text-[13px] font-bold text-[#5b5e66] hover:bg-[#f6f3f2]"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmSave}
            className="flex-1 py-3 rounded-xl bg-[#ec111a] text-[13px] font-bold text-white hover:bg-[#c0000f] shadow-sm"
          >
            Guardar Configuración
          </button>
        </div>

      </div>
    </div>
  );
};