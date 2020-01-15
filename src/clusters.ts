import * as cluster from 'cluster';
import { CpuInfo, cpus } from 'os';

class Cluster {
    private cpus: Array<CpuInfo>;

    constructor() {
        this.cpus = cpus();
        this.init();
    }

    private init(): void {
        if(cluster.isMaster) {
            this.cpus.forEach(() => cluster.fork());
            
            cluster.on('listening', (worker: cluster.Worker) => {
                console.log('Cluster %d connected', worker.process.pid);
            });

            cluster.on('disconnect', (worker: cluster.Worker) => {
                console.log('Cluster %d disconnected', worker.process.pid);
            });

            cluster.on('exit ', (worker: cluster.Worker) => {
                console.log('Cluster %d disconnected', worker.process.pid);
                cluster.fork();
            });

            return;
        }

        require('./index');
    }
}

export default new Cluster();