
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST() {
    const scriptPath = path.resolve(process.cwd(), '..', 'run_governance_cycle.py');

    // Ejecutar el script (asíncrono para no bloquear, pero capturamos el inicio)
    // Usamos 'start' en Windows para desprender el proceso, o '&' en Linux
    // Para simplificar y ver logs, lo haremos con un timeout corto o fire-and-forget

    console.log('🚀 Triggering Governance Cycle via API...');

    try {
        // Opción A: Síncrono (espera a que termine) - Más seguro para demos
        // Opción B: Asíncrono puro - Mejor para UX
        // Vamos con Opción A pero con timeout mental del usuario
        const projectRoot = path.resolve(process.cwd(), '..');
        const { stdout, stderr } = await execAsync(`uv run python "${scriptPath}"`, {
            cwd: projectRoot
        });

        console.log('✅ Cycle Output:', stdout);
        if (stderr) console.error('⚠️ Cycle Stderr:', stderr);

        return Response.json({ success: true, message: 'Cycle completed' });
    } catch (error: any) {
        console.error('❌ Cycle Failed:', error);
        return Response.json({ success: false, error: error.message }, { status: 500 });
    }
}
