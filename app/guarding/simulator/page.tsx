// app/guarding/simulator/page.tsx
'use client';

import { useEffect } from 'react';
import SectionHeader from '@/components/guarding/shared/SectionHeader';
import AgentIntent from '@/components/guarding/simulator/AgentIntent';
import ExecutionSimulator from '@/components/guarding/simulator/ExecutionSimulator';
import { useGuardingState } from '@/components/guarding/GuardingContext';

export default function SimulatorPage() {
  const { 
    sessionAddress, 
    delegationRules, 
    parsedIntentTx, 
    setCurrentSimResult, 
    setRobotState,
    incrementBlocked,
    incrementSuccessful
  } = useGuardingState();

  // Switch robot state to validating when a new transaction is parsing/validating
  useEffect(() => {
    if (parsedIntentTx) {
      setRobotState('validating');
    }
  }, [parsedIntentTx, setRobotState]);

  return (
    <div className="space-y-6">
      <SectionHeader 
        title="Security Simulator" 
        description="Verify AI-driven execution paths in real-time. The sandbox simulates NLP intent parsing and on-chain limit validation." 
      />

      <div className="grid grid-cols-1 gap-8">
        <AgentIntent />
        <ExecutionSimulator
          sessionAddress={sessionAddress}
          delegationRules={delegationRules}
          overrideTxPayload={parsedIntentTx}
          onSimulationEvaluated={(result) => {
            setCurrentSimResult(result);
            // Track validation outcomes
            if (result?.status === 'ALLOWED') incrementSuccessful();
            if (result?.status === 'BLOCKED') incrementBlocked();

            if (result) {
              if (result.status === 'BLOCKED') {
                setRobotState('warning');
              } else {
                setRobotState('listening');
              }
            }
          }}
        />
      </div>
    </div>
  );
}

