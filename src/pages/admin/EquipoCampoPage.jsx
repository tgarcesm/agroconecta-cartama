const TEAM = [
  {
    name: 'Carlos Mendoza',
    location: '📍 Támesis + Valparaíso',
    today: '3 verificaciones hoy',
    status: 'En campo',
    statusStyle: 'bg-green-100 text-green-800',
    stats: { verificaciones: 12, lotes: 4 },
  },
  {
    name: 'Andrés Palacio',
    location: '📍 Jericó + Fredonia',
    today: '1 verificación hoy',
    status: 'Disponible',
    statusStyle: 'bg-gray-100 text-gray-600',
    stats: { verificaciones: 7, lotes: 2 },
  },
  {
    name: 'María López',
    role: 'backoffice',
    location: '📍 Remoto',
    today: 'Gestión documental',
    status: 'Activa',
    statusStyle: 'bg-green-100 text-green-800',
    stats: { verificaciones: 0, lotes: 8 },
  },
]

export default function EquipoCampoPage() {
  return (
    <div className="space-y-5 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-semibold text-primary">Equipo de Campo</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {TEAM.map((member) => (
          <div key={member.name} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-primary px-5 py-4">
              <h3 className="text-background font-semibold text-lg">{member.name}</h3>
              {member.role && (
                <p className="text-background/60 text-xs uppercase tracking-wide">{member.role}</p>
              )}
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm text-gray-600">{member.location}</p>
              <p className="text-sm font-medium text-primary">{member.today}</p>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${member.statusStyle}`}>
                {member.status}
              </span>

              <div className="pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400">Verificaciones semana</p>
                  <p className="text-xl font-bold text-primary">{member.stats.verificaciones}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Lotes publicados</p>
                  <p className="text-xl font-bold text-primary">{member.stats.lotes}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
